interface AccentColor {
	name: string;
	colors: Record<Shade, string>;
}

type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/** Accent palettes selectable in the admin panel, as Tailwind-style shade scales. */
export const accentColors = {
	red_velvet: {
		name: "Red Velvet",
		colors: {
			50: "#fdf3f3",
			100: "#fbe5e5",
			200: "#f9cfcf",
			300: "#f4adad",
			400: "#eb7e7e",
			500: "#df5454",
			600: "#cb3737",
			700: "#aa2b2b",
			800: "#8d2727",
			900: "#762626",
			950: "#561515",
		},
	},
	camelot: {
		name: "Camelot",
		colors: {
			50: "#fbf4f8",
			100: "#f9eaf2",
			200: "#f4d6e6",
			300: "#ecb5d1",
			400: "#df87b2",
			500: "#d16395",
			600: "#bd4576",
			700: "#a3335e",
			800: "#8a2e50",
			900: "#712a44",
			950: "#441324",
		},
	},
	blue_violet: {
		name: "Blue Violet",
		colors: {
			50: "#eef2ff",
			100: "#dfe6ff",
			200: "#c6cfff",
			300: "#a3b1fe",
			400: "#7e87fb",
			500: "#4f4ef3",
			600: "#5142e9",
			700: "#4435cd",
			800: "#382da6",
			900: "#312c83",
			950: "#1e1a4c",
		},
	},
	jungle_green: {
		name: "Jungle Green",
		colors: {
			50: "#f3faf8",
			100: "#d5f2e7",
			200: "#abe4cf",
			300: "#79cfb2",
			400: "#4db495",
			500: "#3aab8b",
			600: "#277a65",
			700: "#236252",
			800: "#204f44",
			900: "#1e433a",
			950: "#0c2721",
		},
	},
	mine_shaft: {
		name: "Mine Shaft",
		colors: {
			50: "#f6f6f6",
			100: "#e7e7e7",
			200: "#d1d1d1",
			300: "#b0b0b0",
			400: "#888888",
			500: "#6d6d6d",
			600: "#5d5d5d",
			700: "#4f4f4f",
			800: "#454545",
			900: "#3d3d3d",
			950: "#292929",
		},
	},
	oregon: {
		name: "Oregon",
		colors: {
			50: "#fdf9ed",
			100: "#f9eecc",
			200: "#f2dd95",
			300: "#ecc55d",
			400: "#e7b038",
			500: "#e09220",
			600: "#c67019",
			700: "#a04e18",
			800: "#863f1a",
			900: "#6e3519",
			950: "#3f1a09",
		},
	},
	pistachio: {
		name: "Pistachio",
		colors: {
			50: "#f9fde8",
			100: "#f1f9ce",
			200: "#e2f4a2",
			300: "#ccea6c",
			400: "#b5dc3f",
			500: "#90b91f",
			600: "#759a16",
			700: "#597615",
			800: "#475d17",
			900: "#3d4f18",
			950: "#1f2c07",
		},
	},
	affair: {
		name: "Affair",
		colors: {
			50: "#f9f6fd",
			100: "#f3edfa",
			200: "#e7daf4",
			300: "#d7bdea",
			400: "#bf95dd",
			500: "#a26bca",
			600: "#864cad",
			700: "#6f3c8f",
			800: "#5c3375",
			900: "#4f2e61",
			950: "#30143e",
		},
	},
	blue_ribbon: {
		name: "Blue Ribbon",
		colors: {
			50: "#eff3ff",
			100: "#dce4fd",
			200: "#c0cffd",
			300: "#95b1fb",
			400: "#6288f8",
			500: "#3c5ef3",
			600: "#283fe8",
			700: "#202cd5",
			800: "#2026ad",
			900: "#202788",
			950: "#181b53",
		},
	},
	azure_radiance: {
		name: "Azure Radiance",
		colors: {
			50: "#edfaff",
			100: "#d6f3ff",
			200: "#b5ecff",
			300: "#83e2ff",
			400: "#48cfff",
			500: "#1eb1ff",
			600: "#0694ff",
			700: "#0080ff",
			800: "#0861c5",
			900: "#0d549b",
			950: "#0e335d",
		},
	},
	indigo: {
		name: "Indigo",
		colors: {
			50: "#faf4ff",
			100: "#f3e6ff",
			200: "#ead2ff",
			300: "#d9aeff",
			400: "#c27bff",
			500: "#ab49ff",
			600: "#9825f8",
			700: "#8315db",
			800: "#6f17b2",
			900: "#5b148f",
			950: "#4b0082",
		},
	},
	solar: {
		name: "Solar",
		colors: {
			50: "#fff3f1",
			100: "#ffe3dd",
			200: "#ffcabf",
			300: "#ffab99",
			400: "#ff7c61",
			500: "#f4482b",
			600: "#dd3f27",
			700: "#b83222",
			800: "#94291d",
			900: "#782219",
			950: "#40100c",
		},
	},
	circula: {
		name: "Circula",
		colors: {
			50: "#eefcf5",
			100: "#d5f7e8",
			200: "#a9efce",
			300: "#77e3b1",
			400: "#43d591",
			500: "#2ab573",
			600: "#209760",
			700: "#187148",
			800: "#145738",
			900: "#10422b",
			950: "#082618",
		},
	},
} as const satisfies Record<string, AccentColor>;

export type AccentColorKey = keyof typeof accentColors;

export const DEFAULT_ACCENT: AccentColorKey = "circula";

export function isAccentColorKey(value: string): value is AccentColorKey {
	return Object.hasOwn(accentColors, value);
}

/** Falls back to the default palette for keys that are no longer offered. */
export function getAccentColor(key: string): AccentColor {
	return accentColors[isAccentColorKey(key) ? key : DEFAULT_ACCENT];
}
