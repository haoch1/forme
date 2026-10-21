# GitHub 镜像与服务器部署

生产域名与目标服务器由部署环境决定，不写入仓库、构建参数或镜像元数据。业务状态与工作台选项保存在各浏览器本地，静态容器无需数据库或可写业务卷；不同域名的浏览器存储互相独立。

推送 main 后，.github/workflows/docker.yml 在 GitHub 执行 Docker 多阶段构建。构建阶段固定 Node.js 24.21.0 与 pnpm 11.25.0，按 frozen lockfile 安装，执行类型、Lint、依赖、组件来源检查，生成完整下载模板并构建网页；运行阶段只包含 Nginx 与 dist。镜像发布到 ghcr.io/haoch1/forme，保留 latest 与完整提交号标签。

服务器 /opt/forme/compose.yaml 使用 deploy/compose.yaml，.env 的 FORME_IMAGE 指向已发布镜像的不可变 digest。服务只监听 127.0.0.1:4183，主机 Nginx 负责域名和 HTTPS；证书使用 Certbot webroot /var/www/letsencrypt。主机配置示例见 deploy/host-nginx.conf，发布前须与现有 Nginx 版本核对并运行 nginx -t。

更新时先备份当前 .env，拉取指定 digest，执行 docker compose up -d --wait，再检查健康状态、网页、SPA 路由和模板下载。回退时恢复上一份 FORME_IMAGE 再运行同一命令。发布记录放在服务器 /opt/forme/releases，保留提交号、镜像 digest 与上一版本。GitHub 登录令牌不得写入仓库、镜像、Compose 或发布记录。

容器 /healthz 返回 200，Docker 自动执行健康检查。HTML 与下载模板不使用长期缓存；带内容摘要的 assets 使用 immutable 缓存。Nginx 使用 SPA fallback，嵌入的同源预览保持可用。
