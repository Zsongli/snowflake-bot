import Canvas, { Image } from "canvas";
import Color from "color";

function CreateImage(src: string) {
    return new Promise<Canvas.Image>((resolve, reject) => {
        const img = new Canvas.Image()
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function parseInt2(asd: string) {
    const sad = parseInt(asd);
    if (isNaN(sad)) return null;
    else return sad;
}

function parseFloat2(asd: string) {
    const sad = parseFloat(asd);
    if (isNaN(sad)) return null;
    else return sad;
}

function HexString(decimal: number) {
    var hex = decimal.toString(16);
    while (hex.length < 6)
        hex += "0";
    if (decimal <= 16777215)
        return "#" + hex;
    return "#" + hex + "FF";
}

export async function DrawColor(color: Color): Promise<Buffer> {
    const canvas = Canvas.createCanvas(128, 128);
    const buffer = canvas.getContext("2d");
    const img = await CreateImage("./assets/img/checkerboard.png");
    buffer.drawImage(img, 0, 0);
    const col = color.rgb().object();
    buffer.fillStyle = `rgba(${Math.round(col.r)}, ${Math.round(col.g)}, ${Math.round(col.b)}, ${+(col.alpha ?? 1).toFixed(3)})`;
    buffer.fillRect(0, 0, 128, 128);
    return canvas.toBuffer();
}

export function Parse(argument: string): Color | null {
    const arg = argument.trim();
    if (arg.startsWith("#") || arg.startsWith("0x")) { //hex format - no transparency
        try {
            return new Color(arg.replace("0x", "#"));
        } catch (error) {
            return null;
        }
    }
    else if (arg.includes(",") && !arg.includes("%") && !arg.includes(".") && !arg.includes("(")) { //rgb(a) format
        const col = arg.split(",");
        if (col.length < 3) return null;
        try {
            if (!col[3])
                return Color.rgb([parseInt2(col[0].trim()), parseInt2(col[1].trim()) ?? 0, parseInt2(col[2].trim()) ?? 0]);
            return Color.rgb([parseInt2(col[0].trim()), parseInt2(col[1].trim()), parseInt2(col[2].trim()), parseInt2(col[3].trim())! / 255]);
        } catch (error) {
            return null;
        }
    }
    else if (arg.includes(",") && !arg.includes("%") && arg.includes(".") && !arg.includes("(")) { //normalized rgb(a)
        const col = arg.split(",");
        if (col.length < 3) return null;
        try {
            if (!col[3])
                return Color.rgb([parseFloat2(col[0].trim())! * 255, parseFloat2(col[1].trim())! * 255, parseFloat2(col[2].trim())! * 255]);
            return Color.rgb([parseFloat2(col[0].trim())! * 255, parseFloat2(col[1].trim())! * 255, parseFloat2(col[2].trim())! * 255, parseFloat2(col[3].trim())]);
        } catch (error) {
            return null;
        }
    }
    else if (arg.includes(",") && arg.includes("%") && !arg.includes("(") || arg.includes("deg")) { //hsl(a)
        const col = arg.replace("deg", "").replace("%", "").split(",");
        if (col.length < 3) return null;
        try {
            if (!col[3])
                return Color.hsl([parseInt2(col[0].trim()), parseInt2(col[1].trim()), parseInt2(col[2].trim())]);
            return Color.hsl([parseInt2(col[0].trim()), parseInt2(col[1].trim()), parseInt2(col[2].trim()), parseFloat2(col[3].trim())]);
        } catch (error) {
            return null;
        }
    }
    else { //other stuff, like decimal
        try {
            const asd = parseInt(arg);
            if (!isNaN(asd)) return new Color(HexString(asd));
            return Color(arg);
        } catch (error) {
            return null;
        }
    }
}