export function createPosition(step: number, branch: number = 0): number {
    return (branch << 6) | step;
}

export function generateHexColorFromString(input: string): string {
    // Convert the input string to a numeric hash
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Calculate hue, saturation, and lightness
    const hue = Math.abs(hash) % 360; // Hue between 0 and 359
    const saturation = 70; // Fixed saturation at 70%
    const lightness = 50 + (Math.abs(hash) % 50); // Lightness between 50% and 99%

    // Convert HSL to RGB
    const [r, g, b] = hslToRgb(hue, saturation, lightness);

    // Convert RGB to hex
    return rgbToHex(r, g, b);
}

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h = h % 360;
    s /= 100;
    l /= 100;

    let r: number, g: number, b: number;

    if (s === 0) {
        r = g = b = l * 255; // Achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        const hk = h / 360;
        r = hue2rgb(p, q, hk + 1 / 3) * 255;
        g = hue2rgb(p, q, hk) * 255;
        b = hue2rgb(p, q, hk - 1 / 3) * 255;
    }

    return [Math.round(r), Math.round(g), Math.round(b)];
}

// Helper function to convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (x: number): string => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}