// Official Tailwind CSS 4.3.3 scales. Semantic pairs follow shadcn/ui conventions.
// Source and MIT license: third-party/sources.json and tailwind-LICENSE.
import defaults from './default-tokens.json';
import type { Mode, Tokens } from './theme';
const scales: Record<string, Record<string,string>> = {
  "zinc": {
    "50": "oklch(98.5% 0 none)",
    "100": "oklch(96.7% 0.001 286.375)",
    "200": "oklch(92% 0.004 286.32)",
    "300": "oklch(87.1% 0.006 286.286)",
    "400": "oklch(70.5% 0.015 286.067)",
    "500": "oklch(55.2% 0.016 285.938)",
    "600": "oklch(44.2% 0.017 285.786)",
    "700": "oklch(37% 0.013 285.805)",
    "800": "oklch(27.4% 0.006 286.033)",
    "900": "oklch(21% 0.006 285.885)",
    "950": "oklch(14.1% 0.005 285.823)"
  },
  "slate": {
    "50": "oklch(98.4% 0.003 247.858)",
    "100": "oklch(96.8% 0.007 247.896)",
    "200": "oklch(92.9% 0.013 255.508)",
    "300": "oklch(86.9% 0.022 252.894)",
    "400": "oklch(70.4% 0.04 256.788)",
    "500": "oklch(55.4% 0.046 257.417)",
    "600": "oklch(44.6% 0.043 257.281)",
    "700": "oklch(37.2% 0.044 257.287)",
    "800": "oklch(27.9% 0.041 260.031)",
    "900": "oklch(20.8% 0.042 265.755)",
    "950": "oklch(12.9% 0.042 264.695)"
  },
  "gray": {
    "50": "oklch(98.5% 0.002 247.839)",
    "100": "oklch(96.7% 0.003 264.542)",
    "200": "oklch(92.8% 0.006 264.531)",
    "300": "oklch(87.2% 0.01 258.338)",
    "400": "oklch(70.7% 0.022 261.325)",
    "500": "oklch(55.1% 0.027 264.364)",
    "600": "oklch(44.6% 0.03 256.802)",
    "700": "oklch(37.3% 0.034 259.733)",
    "800": "oklch(27.8% 0.033 256.848)",
    "900": "oklch(21% 0.034 264.665)",
    "950": "oklch(13% 0.028 261.692)"
  },
  "stone": {
    "50": "oklch(98.5% 0.001 106.423)",
    "100": "oklch(97% 0.001 106.424)",
    "200": "oklch(92.3% 0.003 48.717)",
    "300": "oklch(86.9% 0.005 56.366)",
    "400": "oklch(70.9% 0.01 56.259)",
    "500": "oklch(55.3% 0.013 58.071)",
    "600": "oklch(44.4% 0.011 73.639)",
    "700": "oklch(37.4% 0.01 67.558)",
    "800": "oklch(26.8% 0.007 34.298)",
    "900": "oklch(21.6% 0.006 56.043)",
    "950": "oklch(14.7% 0.004 49.25)"
  },
  "indigo": {
    "50": "oklch(96.2% 0.018 272.314)",
    "100": "oklch(93% 0.034 272.788)",
    "200": "oklch(87% 0.065 274.039)",
    "300": "oklch(78.5% 0.115 274.713)",
    "400": "oklch(67.3% 0.182 276.935)",
    "500": "oklch(58.5% 0.233 277.117)",
    "600": "oklch(51.1% 0.262 276.966)",
    "700": "oklch(45.7% 0.24 277.023)",
    "800": "oklch(39.8% 0.195 277.366)",
    "900": "oklch(35.9% 0.144 278.697)",
    "950": "oklch(25.7% 0.09 281.288)"
  },
  "emerald": {
    "50": "oklch(97.9% 0.021 166.113)",
    "100": "oklch(95% 0.052 163.051)",
    "200": "oklch(90.5% 0.093 164.15)",
    "300": "oklch(84.5% 0.143 164.978)",
    "400": "oklch(76.5% 0.177 163.223)",
    "500": "oklch(69.6% 0.17 162.48)",
    "600": "oklch(59.6% 0.145 163.225)",
    "700": "oklch(50.8% 0.118 165.612)",
    "800": "oklch(43.2% 0.095 166.913)",
    "900": "oklch(37.8% 0.077 168.94)",
    "950": "oklch(26.2% 0.051 172.552)"
  },
  "sky": {
    "50": "oklch(97.7% 0.013 236.62)",
    "100": "oklch(95.1% 0.026 236.824)",
    "200": "oklch(90.1% 0.058 230.902)",
    "300": "oklch(82.8% 0.111 230.318)",
    "400": "oklch(74.6% 0.16 232.661)",
    "500": "oklch(68.5% 0.169 237.323)",
    "600": "oklch(58.8% 0.158 241.966)",
    "700": "oklch(50% 0.134 242.749)",
    "800": "oklch(44.3% 0.11 240.79)",
    "900": "oklch(39.1% 0.09 240.876)",
    "950": "oklch(29.3% 0.066 243.157)"
  },
  "cyan": {
    "50": "oklch(98.4% 0.019 200.873)",
    "100": "oklch(95.6% 0.045 203.388)",
    "200": "oklch(91.7% 0.08 205.041)",
    "300": "oklch(86.5% 0.127 207.078)",
    "400": "oklch(78.9% 0.154 211.53)",
    "500": "oklch(71.5% 0.143 215.221)",
    "600": "oklch(60.9% 0.126 221.723)",
    "700": "oklch(52% 0.105 223.128)",
    "800": "oklch(45% 0.085 224.283)",
    "900": "oklch(39.8% 0.07 227.392)",
    "950": "oklch(30.2% 0.056 229.695)"
  },
  "red": {
    "50": "oklch(97.1% 0.013 17.38)",
    "100": "oklch(93.6% 0.032 17.717)",
    "200": "oklch(88.5% 0.062 18.334)",
    "300": "oklch(80.8% 0.114 19.571)",
    "400": "oklch(70.4% 0.191 22.216)",
    "500": "oklch(63.7% 0.237 25.331)",
    "600": "oklch(57.7% 0.245 27.325)",
    "700": "oklch(50.5% 0.213 27.518)",
    "800": "oklch(44.4% 0.177 26.899)",
    "900": "oklch(39.6% 0.141 25.723)",
    "950": "oklch(25.8% 0.092 26.042)"
  },
  "pink": {
    "50": "oklch(97.1% 0.014 343.198)",
    "100": "oklch(94.8% 0.028 342.258)",
    "200": "oklch(89.9% 0.061 343.231)",
    "300": "oklch(82.3% 0.12 346.018)",
    "400": "oklch(71.8% 0.202 349.761)",
    "500": "oklch(65.6% 0.241 354.308)",
    "600": "oklch(59.2% 0.249 0.584)",
    "700": "oklch(52.5% 0.223 3.958)",
    "800": "oklch(45.9% 0.187 3.815)",
    "900": "oklch(40.8% 0.153 2.432)",
    "950": "oklch(28.4% 0.109 3.907)"
  },
  "yellow": {
    "50": "oklch(98.7% 0.026 102.212)",
    "100": "oklch(97.3% 0.071 103.193)",
    "200": "oklch(94.5% 0.129 101.54)",
    "300": "oklch(90.5% 0.182 98.111)",
    "400": "oklch(85.2% 0.199 91.936)",
    "500": "oklch(79.5% 0.184 86.047)",
    "600": "oklch(68.1% 0.162 75.834)",
    "700": "oklch(55.4% 0.135 66.442)",
    "800": "oklch(47.6% 0.114 61.907)",
    "900": "oklch(42.1% 0.095 57.708)",
    "950": "oklch(28.6% 0.066 53.813)"
  },
  "lime": {
    "50": "oklch(98.6% 0.031 120.757)",
    "100": "oklch(96.7% 0.067 122.328)",
    "200": "oklch(93.8% 0.127 124.321)",
    "300": "oklch(89.7% 0.196 126.665)",
    "400": "oklch(84.1% 0.238 128.85)",
    "500": "oklch(76.8% 0.233 130.85)",
    "600": "oklch(64.8% 0.2 131.684)",
    "700": "oklch(53.2% 0.157 131.589)",
    "800": "oklch(45.3% 0.124 130.933)",
    "900": "oklch(40.5% 0.101 131.063)",
    "950": "oklch(27.4% 0.072 132.109)"
  }
};
const families = [["zinc","锌灰"],["slate","石板蓝灰"],["gray","雾灰"],["stone","暖石灰"],["indigo","靛蓝"],["emerald","翡翠绿"],["sky","天蓝"],["cyan","湖水青"],["red","经典红"],["pink","樱花粉"],["yellow","明亮黄"],["lime","青柠绿"]];
const neutrals = new Set(['zinc','slate','gray','stone']);
export const officialPalettes: Record<string,{label:string;styles:Record<Mode,Tokens>}> = Object.fromEntries(families.map(([name,label])=>{
  const c=scales[name];
  const light:Tokens={...defaults.light};
  const dark:Tokens={...defaults.dark,radius:defaults.light.radius};
  if(neutrals.has(name)){
    Object.assign(light,{foreground:c[950], 'card-foreground':c[950], 'popover-foreground':c[950],primary:c[900], 'primary-foreground':c[50],secondary:c[100], 'secondary-foreground':c[900],muted:c[100],'muted-foreground':c[500],accent:c[100],'accent-foreground':c[900],border:c[200],input:c[200],ring:c[400],sidebar:c[50],'sidebar-foreground':c[950],'sidebar-primary':c[900],'sidebar-primary-foreground':c[50],'sidebar-accent':c[100],'sidebar-accent-foreground':c[900],'sidebar-border':c[200],'sidebar-ring':c[400]});
    Object.assign(dark,{background:c[900],foreground:c[50],card:c[800],'card-foreground':c[50],popover:c[800],'popover-foreground':c[50],primary:c[50],'primary-foreground':c[900],secondary:c[700],'secondary-foreground':c[50],muted:c[700],'muted-foreground':c[300],accent:c[700],'accent-foreground':c[50],border:c[600],input:c[600],ring:c[400],sidebar:c[800],'sidebar-foreground':c[50],'sidebar-primary':c[50],'sidebar-primary-foreground':c[900],'sidebar-accent':c[700],'sidebar-accent-foreground':c[50],'sidebar-border':c[600],'sidebar-ring':c[400]});
  }else{
    Object.assign(light,{primary:c[700],'primary-foreground':defaults.light.background,accent:c[50],'accent-foreground':c[900],ring:c[600],'sidebar-primary':c[700],'sidebar-primary-foreground':defaults.light.background,'sidebar-accent':c[50],'sidebar-accent-foreground':c[900],'sidebar-ring':c[600]});
    Object.assign(dark,{primary:c[400],'primary-foreground':defaults.dark.background,accent:c[950],'accent-foreground':c[200],ring:c[400],'sidebar-primary':c[400],'sidebar-primary-foreground':defaults.dark.background,'sidebar-accent':c[950],'sidebar-accent-foreground':c[200],'sidebar-ring':c[400]});
  }
  for(let i=1;i<=5;i++){light['chart-'+i]=c[[700,600,500,400,300][i-1]];dark['chart-'+i]=c[[400,300,500,200,600][i-1]];}
  return [name,{label,styles:{light,dark}}];
}));
