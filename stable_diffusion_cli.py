# Generates images corresponding a each prompt in a list of prompts using stable diffusion, streamlined through modal. 

# example command to run: 
# modal run stable_diffusion_cli.py \
# --prompt="sailor sailing through the ocean at night;storm knocking a boat at night;sailer drowning in night"

# Basic setup
from __future__ import annotations

import io
import os
import time
from pathlib import Path

import modal

stub = modal.Stub("stable-diffusion-cli")

import typer

app = typer.Typer()

# ## Model dependencies

model_id = "runwayml/stable-diffusion-v1-5"
cache_path = "/vol/cache"


def download_models():
    import diffusers
    import torch

    hugging_face_token = os.environ["HUGGINGFACE_TOKEN"]

    # Download scheduler configuration. Experiment with different schedulers
    # to identify one that works best for your use-case.
    scheduler = diffusers.DPMSolverMultistepScheduler.from_pretrained(
        model_id,
        subfolder="scheduler",
        use_auth_token=hugging_face_token,
        cache_dir=cache_path,
    )
    scheduler.save_pretrained(cache_path, safe_serialization=True)

    # Downloads all other models.
    pipe = diffusers.StableDiffusionPipeline.from_pretrained(
        model_id,
        use_auth_token=hugging_face_token,
        revision="fp16",
        torch_dtype=torch.float16,
        cache_dir=cache_path,
    )
    pipe.save_pretrained(cache_path, safe_serialization=True)


image = (
    modal.Image.debian_slim(python_version="3.10")
    .pip_install(
        "accelerate",
        "diffusers[torch]>=0.10",
        "ftfy",
        "torch",
        "torchvision",
        "transformers",
        "triton",
        "safetensors",
    )
    .pip_install("xformers", pre=True)
    .run_function(
        download_models,
        secrets=[modal.Secret.from_name("huggingface-secret")],
    )
)
stub.image = image

# ## Using container lifecycle methods

class StableDiffusion:
    def __enter__(self):
        import diffusers
        import torch

        torch.backends.cuda.matmul.allow_tf32 = True

        scheduler = diffusers.DPMSolverMultistepScheduler.from_pretrained(
            cache_path,
            subfolder="scheduler",
            solver_order=2,
            prediction_type="epsilon",
            thresholding=False,
            algorithm_type="dpmsolver++",
            solver_type="midpoint",
            denoise_final=True,  # important if steps are <= 10
        )
        self.pipe = diffusers.StableDiffusionPipeline.from_pretrained(
            cache_path, scheduler=scheduler
        ).to("cuda")
        self.pipe.enable_xformers_memory_efficient_attention()

    @stub.function(gpu="A10G")
    def run_inference(
        self, prompts: str, steps: int = 20, batch_size: int = 4
    ) -> list[bytes]:
        import torch

        delimiter = ";"
        prompts: list[str] = prompts.split(delimiter)
        with torch.inference_mode():
            with torch.autocast("cuda"):
                images = self.pipe(
                    prompts,
                    # [prompt] * batch_size,
                    num_inference_steps=steps,
                    guidance_scale=7.0,
                ).images
                print(type(images))

        # Convert to PNG bytes
        image_output = []
        for image in images:
            with io.BytesIO() as buf:
                image.save(buf, format="PNG")
                image_output.append(buf.getvalue())
        return image_output

@stub.local_entrypoint
def entrypoint(
    prompts: str, samples: int = 1, steps: int = 10, batch_size: int = 1
):
    cur_dir = Path().resolve()
    sub_dir = 'stable-diffusion'
    dir = cur_dir / sub_dir
    if not dir.exists():
        dir.mkdir(exist_ok=True, parents=True)

    sd = StableDiffusion()
    t0 = time.time()
    images = sd.run_inference.call(prompts, steps, batch_size)
    total_time = time.time() - t0
    # print(
    #     f"Sample {i} took {total_time:.3f}s ({(total_time)/len(images):.3f}s / image)."
    # )
    for j, image_bytes in enumerate(images):
        output_path = dir / f"output_{j}.png"
        print(f"Saving it to {output_path}")
        with open(output_path, "wb") as f:
            f.write(image_bytes)

