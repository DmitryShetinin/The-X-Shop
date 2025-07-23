// vite.config.ts
import { defineConfig } from "file:///C:/Users/Shche/OneDrive/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/project/The%20X%20Shop/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Shche/OneDrive/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/project/The%20X%20Shop/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import viteCompression from "file:///C:/Users/Shche/OneDrive/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/project/The%20X%20Shop/node_modules/vite-plugin-compression/dist/index.mjs";
import { componentTagger } from "file:///C:/Users/Shche/OneDrive/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/project/The%20X%20Shop/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Shche\\OneDrive\\\u0420\u0430\u0431\u043E\u0447\u0438\u0439 \u0441\u0442\u043E\u043B\\project\\The X Shop";
var vite_config_default = defineConfig(({ mode }) => ({
  define: {
    // Make environment variables available to the client
    "process.env.VERCEL": JSON.stringify(process.env.VERCEL),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || mode)
  },
  build: {
    minify: "terser",
    sourcemap: mode === "development",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          vendor: ["@supabase/supabase-js", "@tanstack/react-query"],
          charts: ["recharts", "xlsx", "framer-motion"]
        }
      }
    }
  },
  server: {
    host: "::",
    port: 3e3,
    strictPort: false,
    headers: {
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1"
    },
    historyApiFallback: true
  },
  base: "/",
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz"
    }),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br"
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTaGNoZVxcXFxPbmVEcml2ZVxcXFxcdTA0MjBcdTA0MzBcdTA0MzFcdTA0M0VcdTA0NDdcdTA0MzhcdTA0MzkgXHUwNDQxXHUwNDQyXHUwNDNFXHUwNDNCXFxcXHByb2plY3RcXFxcVGhlIFggU2hvcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcU2hjaGVcXFxcT25lRHJpdmVcXFxcXHUwNDIwXHUwNDMwXHUwNDMxXHUwNDNFXHUwNDQ3XHUwNDM4XHUwNDM5IFx1MDQ0MVx1MDQ0Mlx1MDQzRVx1MDQzQlxcXFxwcm9qZWN0XFxcXFRoZSBYIFNob3BcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1NoY2hlL09uZURyaXZlLyVEMCVBMCVEMCVCMCVEMCVCMSVEMCVCRSVEMSU4NyVEMCVCOCVEMCVCOSUyMCVEMSU4MSVEMSU4MiVEMCVCRSVEMCVCQi9wcm9qZWN0L1RoZSUyMFglMjBTaG9wL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tIFwidml0ZS1wbHVnaW4tY29tcHJlc3Npb25cIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIGRlZmluZToge1xyXG4gICAgLy8gTWFrZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgYXZhaWxhYmxlIHRvIHRoZSBjbGllbnRcclxuICAgICdwcm9jZXNzLmVudi5WRVJDRUwnOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5WRVJDRUwpLFxyXG4gICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgbW9kZSksXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcclxuICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyxcclxuICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXHJcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgcmVhY3Q6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXHJcbiAgICAgICAgICB2ZW5kb3I6IFsnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJywgJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSddLFxyXG4gICAgICAgICAgY2hhcnRzOiBbJ3JlY2hhcnRzJywgJ3hsc3gnLCAnZnJhbWVyLW1vdGlvbiddLFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogMzAwMCxcclxuICAgIHN0cmljdFBvcnQ6IGZhbHNlLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICAnQ29ubmVjdGlvbic6ICdrZWVwLWFsaXZlJyxcclxuICAgICAgJ1VwZ3JhZGUtSW5zZWN1cmUtUmVxdWVzdHMnOiAnMSdcclxuICAgIH0sXHJcbiAgICBoaXN0b3J5QXBpRmFsbGJhY2s6IHRydWVcclxuICB9LFxyXG4gIGJhc2U6ICcvJyxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXIoKSxcclxuICAgIHZpdGVDb21wcmVzc2lvbih7XHJcbiAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxyXG4gICAgICBleHQ6ICcuZ3onLFxyXG4gICAgfSksXHJcbiAgICB2aXRlQ29tcHJlc3Npb24oe1xyXG4gICAgICBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycsXHJcbiAgICAgIGV4dDogJy5icicsXHJcbiAgICB9KSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWthLFNBQVMsb0JBQW9CO0FBQy9iLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxxQkFBcUI7QUFDNUIsU0FBUyx1QkFBdUI7QUFKaEMsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUE7QUFBQSxJQUVOLHNCQUFzQixLQUFLLFVBQVUsUUFBUSxJQUFJLE1BQU07QUFBQSxJQUN2RCx3QkFBd0IsS0FBSyxVQUFVLFFBQVEsSUFBSSxZQUFZLElBQUk7QUFBQSxFQUNyRTtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVyxTQUFTO0FBQUEsSUFDcEIsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osT0FBTyxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzVCLFFBQVEsQ0FBQyx5QkFBeUIsdUJBQXVCO0FBQUEsVUFDekQsUUFBUSxDQUFDLFlBQVksUUFBUSxlQUFlO0FBQUEsUUFDOUM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQLGNBQWM7QUFBQSxNQUNkLDZCQUE2QjtBQUFBLElBQy9CO0FBQUEsSUFDQSxvQkFBb0I7QUFBQSxFQUN0QjtBQUFBLEVBQ0EsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsSUFDMUMsZ0JBQWdCO0FBQUEsTUFDZCxXQUFXO0FBQUEsTUFDWCxLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsSUFDRCxnQkFBZ0I7QUFBQSxNQUNkLFdBQVc7QUFBQSxNQUNYLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxFQUNILEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
