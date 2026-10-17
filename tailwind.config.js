/** Hoja compilada para GitHub Pages. Fuente: clases usadas por index.html. */
module.exports = {
  content: ["./index.html"],
  theme: { extend: {
    fontFamily: { sans: ["Outfit", "sans-serif"] },
    colors: {
      brand: { teal:"#007b85", dark:"#00205b", green:"#70ad47", yellow:"#ffb600" },
      slate: {
        50:"#f8fafc",100:"#f1f5f9",200:"#e2e8f0",300:"#cbd5e1",
        400:"#94a3b8",500:"#64748b",600:"#475569",700:"#334155",
        800:"#1e293b",900:"#0f172a"
      }
    },
    animation: {float:"float 6s ease-in-out infinite", "pulse-glow":"pulseGlow 6s ease-in-out infinite"},
    keyframes: {
      float: {"0%, 100%":{transform:"translateY(0)"},"50%":{transform:"translateY(-8px)"}},
      pulseGlow: {"0%, 100%":{opacity:"0.05"},"50%":{opacity:"0.1"}}
    }
  }},
  plugins: []
};
