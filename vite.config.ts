// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import Inspector from 'vite-plugin-react-inspector'


// export default defineConfig({
//   plugins: [Inspector(), react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:8080",
//         changeOrigin: true,
//         headers: { Origin: "http://localhost:8080" }, // làm backend thấy request cùng nguồn
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Inspector from "vite-plugin-react-inspector";

const BACKEND = "https://quanganbe.onrender.com";

export default defineConfig({
  plugins: [Inspector(), react()],
  server: {
    proxy: {
      "/api": {
        target: BACKEND,
        changeOrigin: true,
        secure: true,
        headers: { Origin: BACKEND }, // backend thấy request cùng nguồn, tránh lỗi CORS
      },
    },
  },
});