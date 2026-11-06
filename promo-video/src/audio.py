# Original soundtrack, synthesized in code (no third-party samples or music): 15s, 48kHz stereo.
# A warm pad in D major with a slow swell, plus sound design synced to the animation's cue times.
import numpy as np, wave, pathlib, sys
SR = 48000; DUR = 15.0; N = int(SR * DUR)
rng = np.random.default_rng(7)
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)

def add(sig, at, pan=0.0, gain=1.0):
    i = int(at * SR); j = min(N, i + len(sig)); s = sig[: j - i] * gain
    L[i:j] += s * (1 - pan) * .5 * 2 ** .5 * .71; R[i:j] += s * (1 + pan) * .5 * 2 ** .5 * .71

def env(n, a, d, sustain=0.0, r=None):
    e = np.ones(n); A = int(a * SR); D = int(d * SR)
    e[:A] = np.linspace(0, 1, A) if A else 1
    if D: e[A:A + D] = np.linspace(1, sustain, min(D, n - A))[: max(0, min(D, n - A))]
    e[A + D:] = sustain
    if r: Rn = int(r * SR); e[-Rn:] *= np.linspace(1, 0, Rn)
    return e

def lp(x, cut):  # one-pole low-pass
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros_like(x); acc = 0.0
    for k in range(len(x)): acc = (1 - a) * x[k] + a * acc; y[k] = acc
    return y

def tone(f, dur, harm=(1, .5, .25), decay=3.0):
    n = int(dur * SR); tt = np.arange(n) / SR
    s = sum(h * np.sin(2 * np.pi * f * (k + 1) * tt) for k, h in enumerate(harm))
    return s * np.exp(-decay * tt)

def bell(f, dur=1.6):  # soft glassy chime
    n = int(dur * SR); tt = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * tt) + .45 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-6 * tt) + .2 * np.sin(2 * np.pi * f * 5.4 * tt) * np.exp(-10 * tt))
    return s * np.exp(-2.6 * tt) * env(n, .004, 0, 1)

def whoosh(dur, lo=300, hi=2400, rise=.55):
    n = int(dur * SR); noise = rng.standard_normal(n)
    # sweep a band by blending two low-passes
    a = lp(noise, hi); b = lp(noise, lo); x = a - b
    sh = np.sin(np.pi * np.clip(np.arange(n) / n / rise, 0, 1) * .5) * np.linspace(1, 0, n) ** 1.4
    return x * sh

def pluck(f, dur=1.2):  # Karplus-Strong, like a plucked thread
    n = int(dur * SR); p = int(SR / f); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for k in range(n): out[k] = buf[k % p]; buf[k % p] = .5 * (buf[k % p] + buf[(k + 1) % p]) * .996
    return out * env(n, .002, 0, 1, .2)

def pop(f=900):
    n = int(.12 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * (f + 600 * np.exp(-40 * tt)) * tt) * np.exp(-38 * tt)

def thud():
    n = int(.5 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * (70 + 60 * np.exp(-18 * tt)) * tt) * np.exp(-9 * tt)

# ---- music bed: D major pad (D, F#, A, + B colour), slow swell and lift at the end ----
chords = [(0.0, [146.83, 220.0, 293.66, 369.99]), (4.4, [123.47, 185.0, 246.94, 293.66]),
          (8.6, [146.83, 196.0, 246.94, 293.66]), (11.6, [164.81, 220.0, 277.18, 329.63]), (13.4, [146.83, 220.0, 293.66, 440.0])]
pad = np.zeros(N)
for ci, (st, notes) in enumerate(chords):
    en = chords[ci + 1][0] if ci + 1 < len(chords) else DUR
    i, j = int(st * SR), int(min(DUR, en + .6) * SR); n = j - i; tt = np.arange(n) / SR
    s = np.zeros(n)
    for f in notes:
        for det in (-.12, .12):
            ph = rng.uniform(0, 2 * np.pi)
            s += np.sin(2 * np.pi * (f + det) * tt + ph) + .3 * np.sin(2 * np.pi * 2 * (f + det) * tt + ph)
    s *= env(n, .5, 0, 1, .6)
    pad[i:j] += s
pad = lp(pad, 1800) * .045
pad *= np.clip(np.interp(t, [0, 1, 1.9, 13.3, 13.8, 14.6, 15], [.35, .5, 1, 1, 1.25, 1.1, 0]), 0, 2)
L += pad; R += pad
# soft pulse (felt kick) from the title onward, gives the edit its tempo (~120 bpm)
for k in np.arange(1.9, 13.2, .5):
    add(thud() * .10, k)

# ---- sound design, aligned with the animation cue times ----
add(bell(587.33, 2.2), 0.05, 0, .07)                     # crown appears
add(whoosh(1.2, 200, 1800), 1.0, .4, .35)                # parochet slides open
add(bell(880, 2.0), 1.45, 0, .05)                        # light
for i in range(4): add(whoosh(.45, 600, 4200, .3), 1.7 + i * .09, -.3, .12)   # stripes weave in
for i, f in enumerate([587.33, 659.25, 739.99, 880]): add(pluck(f, .9), 2.0 + i * .16, -.2 + i * .13, .09)  # title lines
add(whoosh(.9, 150, 1200), 4.35, 0, .3)                  # blue flood
for at, f in [(5.85, 440), (6.75, 493.88), (7.75, 587.33)]: add(pluck(f, 1.4), at, 0, .2)   # knots tie
for at in (6.35, 7.35): add(bell(1318.5, 1.2), at, .2, .035)   # verse marks fall away
add(whoosh(.8, 250, 2200), 8.45, -.2, .2)                # card becomes the phone
for at in (9.3, 10.05, 10.7):
    for k in range(3): add(pop(1400) * .2, at + .08 + k * .12, .3, .25)    # typing
for at in (9.75, 10.45, 11.05): add(pop(820), at, .25, .22)              # message lands
add(whoosh(.8, 200, 2000), 11.45, -.4, .26)              # phone flies out
add(thud(), 12.2, 0, .3)                                 # photo lands
for k, f in enumerate([1760, 2093, 2637, 3136]): add(bell(f, 1.0), 12.42 + k * .06, -.3 + k * .2, .03)   # jewels
add(whoosh(.7, 150, 1400), 13.2, 0, .3)                  # atarah shutter
add(thud() * .8, 13.7, 0, .4)
for f, d in [(587.33, 0), (739.99, .05), (880, .1), (1174.66, .16)]: add(bell(f, 1.8), 13.75 + d, 0, .06)   # logo chord
add(pop(700), 14.25, 0, .25)                             # CTA

mix = np.stack([L, R], 1)
mix /= max(1e-9, np.abs(mix).max()) / .89
mix[: int(.01 * SR)] *= np.linspace(0, 1, int(.01 * SR))[:, None]
mix[-int(.35 * SR):] *= np.linspace(1, 0, int(.35 * SR))[:, None]
out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).parent.parent / 'build' / 'soundtrack.wav')
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', out)
