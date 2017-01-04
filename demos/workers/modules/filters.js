export function none() {}

export function grayscale({ data: d }) {
  for (let i = 0; i < d.length; i += 4) {
    const [r, g, b] = [d[i], d[i + 1], d[i + 2]];

    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    d[i] = d[i + 1] = d[i + 2] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
};

export function brighten({ data: d }) {
  for (let i = 0; i < d.length; ++i) {
    d[i] *= 1.2;
  }
};
