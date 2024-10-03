// vite.config.ts
import { defineConfig } from "file:///C:/Users/qwerg/Desktop/programming/react/sky-scope/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/qwerg/Desktop/programming/react/sky-scope/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\qwerg\\Desktop\\programming\\react\\sky-scope";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define aliases for directories
      "@src": path.resolve(__vite_injected_original_dirname, "src")
      // Add more aliases as needed
    }
  },
  server: {
    proxy: {
      "/api/naver": {
        target: "https://openapi.naver.com",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api\/naver/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxxd2VyZ1xcXFxEZXNrdG9wXFxcXHByb2dyYW1taW5nXFxcXHJlYWN0XFxcXHNreS1zY29wZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccXdlcmdcXFxcRGVza3RvcFxcXFxwcm9ncmFtbWluZ1xcXFxyZWFjdFxcXFxza3ktc2NvcGVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3F3ZXJnL0Rlc2t0b3AvcHJvZ3JhbW1pbmcvcmVhY3Qvc2t5LXNjb3BlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIC8vIERlZmluZSBhbGlhc2VzIGZvciBkaXJlY3Rvcmllc1xuICAgICAgJ0BzcmMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgICAvLyBBZGQgbW9yZSBhbGlhc2VzIGFzIG5lZWRlZFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaS9uYXZlcic6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9vcGVuYXBpLm5hdmVyLmNvbScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGlcXC9uYXZlci8sICcnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVixTQUFTLG9CQUFvQjtBQUNuWCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUE7QUFBQSxNQUVMLFFBQVEsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQTtBQUFBLElBRXZDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsY0FBYztBQUFBLFFBQ1osUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFBQSxVQUFRQSxNQUFLLFFBQVEsaUJBQWlCLEVBQUU7QUFBQSxNQUNuRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
