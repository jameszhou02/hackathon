import io
from pathlib import Path
import select
from shutil import rmtree
import subprocess as sp
import os
import sys
import stat
from typing import Dict, Tuple, Optional, IO
import librosa
import numpy as np
from scipy import signal
import soundfile as sf
import modal

stub = modal.Stub('music-analysis')

app_image = (
    modal.Image.debian_slim()
    .pip_install(
        "https://github.com/openai/whisper/archive/9f70a352f9f8630ab3aa0d06af5cb9532bd8c21d.tar.gz",
        "aubio",
        "demucs",
    )
)
stub.image = app_image

'''
BEGINNING of demucs script code (copied directly from FAIR)
'''

model = "htdemucs"
extensions = ["mp3", "wav", "ogg", "flac"]  # we will look for all those file types.
two_stems = None   # only separate one stems from the rest, for instance
# two_stems = "vocals"

# Options for the output audio.
mp3 = True
mp3_rate = 320
float32 = False  # output as float 32 wavs, unsused if 'mp3' is True.
int24 = False    # output as int24 wavs, unused if 'mp3' is True.
# You cannot set both `float32 = True` and `int24 = True` !!

ROOT_DIR = Path(__file__).resolve().parents[0]
in_path = str(ROOT_DIR / 'music/originals')
out_path = str(ROOT_DIR / 'music/separated')

def find_files(in_path):
    out = []
    for file in Path(in_path).iterdir():
        if file.suffix.lower().lstrip(".") in extensions:
            out.append(file)
    return out

def copy_process_streams(process: sp.Popen):
    def raw(stream: Optional[IO[bytes]]) -> IO[bytes]:
        assert stream is not None
        if isinstance(stream, io.BufferedIOBase):
            stream = stream.raw
        return stream

    p_stdout, p_stderr = raw(process.stdout), raw(process.stderr)
    stream_by_fd: Dict[int, Tuple[IO[bytes], io.StringIO, IO[str]]] = {
        p_stdout.fileno(): (p_stdout, sys.stdout),
        p_stderr.fileno(): (p_stderr, sys.stderr),
    }
    fds = list(stream_by_fd.keys())

    while fds:
        # `select` syscall will wait until one of the file descriptors has content.
        ready, _, _ = select.select(fds, [], [])
        for fd in ready:
            p_stream, std = stream_by_fd[fd]
            raw_buf = p_stream.read(2 ** 16)
            if not raw_buf:
                fds.remove(fd)
                continue
            buf = raw_buf.decode()
            std.write(buf)
            std.flush()

# @stub.function(gpu="A10G")
def separate(inp=None, outp=None):
    inp = inp or in_path
    outp = outp or out_path
    cmd = ["python3", "-m", "demucs.separate", "-o", str(outp), "-n", model]
    if mp3:
        cmd += ["--mp3", f"--mp3-bitrate={mp3_rate}"]
    if float32:
        cmd += ["--float32"]
    if int24:
        cmd += ["--int24"]
    if two_stems is not None:
        cmd += [f"--two-stems={two_stems}"]
    files = [str(f) for f in find_files(inp)]
    if not files:
        print(f"No valid audio files in {in_path}")
        return
    print("Going to separate the files:")
    print('\n'.join(files))
    print("With command: ", " ".join(cmd))
    p = sp.Popen(cmd + files, stdout=sp.PIPE, stderr=sp.PIPE)
    copy_process_streams(p)
    p.wait()
    if p.returncode != 0:
        print("Command failed, something went wrong.")

'''
END of demucs script code (copied directly from FAIR)
'''

BESSEL_LP = [9.44685778e-4, 0.00188937, 9.44685778e-4, -1.91118480, 0.91496354]
# LP means lowpass (filter). These are Bessel coeffs in order of b0, b1, b2, a1, a2

def transient_detection(inp=None, sink=str(ROOT_DIR / 'music/temp.wav')):
    '''
    inp should be the folder containing stems, i.e. you pass in the song
    '''
    inp = inp or in_path
    drums, _ = librosa.load(inp + '/drums.mp3')
    # samplerate = drums.samplerate

    b, a = signal.butter(3, 0.02)
    drums = signal.lfilter(b, a, drums)
    sf.write('music/temp.wav', drums, 22050, 'PCM_24')

    x, sr = librosa.load(sink)
    onset_frames = librosa.onset.onset_detect(
        x, sr=sr, wait=1, pre_avg=1, post_avg=1, pre_max=1, post_max=1)
    onset_times = librosa.frames_to_time(onset_frames)
    # clicks = librosa.clicks(frames=onset_frames, sr=sr, length=len(x))
    # sf.write('music/clicks2.wav', x+clicks, 22050, 'PCM_24')

    return onset_times

def bpm_detection(inp=None, sink=str(ROOT_DIR / 'music/temp.wav')):
    '''
    really poor accuracy of bpm detection lol...
    lesson: never use aubio again
    '''
    full_track, sr = librosa.load(inp)
    tempo, beats = librosa.beat.beat_track(y=full_track, sr=sr)

    return tempo

# @stub.local_entrypoint
# def main():
#     separate.call()
if __name__ == '__main__':
    # separate()
    song_name = 'turnonthelightsagain'
    FOR_TRANSIENT = str(ROOT_DIR / f'music/separated/htdemucs/{song_name}')
    transients = transient_detection(FOR_TRANSIENT)
    FOR_BPM = str(ROOT_DIR / f'music/originals/{song_name}.mp3')
    print(bpm_detection(FOR_BPM))
