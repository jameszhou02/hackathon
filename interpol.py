# ====================================
# ======interpolation======
# ====================================
# interpolated 
from __future__ import annotations

import io
import os
import time
from pathlib import Path

import modal

!pip install git+https://github.com/google-research/frame-interpolation.git

def interpol():
    import os
    import sys
    sys.path.append('/frame_interpolation/src/frame_interpolation/eval')
    import interpolator_cli

    cur_dir = os.getcwd()
    frames_dir = os.path.join(cur_dir, 'stable-diffusion')
    model_dir = os.path.join(cur_dir, 'frame_interpolation/saved_model')

    output_video = True 
    output_video_fps = 30

    interpolator_cli(
        model_path=model_dir,
        pattern=frames_dir,
        fps=output_video_fps,
        output_video=output_video
    )
