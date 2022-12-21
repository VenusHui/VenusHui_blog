# VenusHui's Blog

## 项目背景

早在高中时期就有一个 **记录自己生活** 的想法了，只是那时因为技术以及硬件条件的限制，最终只能以纸笔为载体。

大学之后，纸笔逐渐淡出了我的生活，取而代之的是 PC 以及 iPad 。相应的，自己的日常也从笔记本中走了出来，去到了相册、备忘录、抖音、小红书和B站里，但我总觉得这样的形式缺了点什么，并不是说它们不好，社交属性，庞大的信息流都是它们引以为傲的优势，但也正因为此，它们相比传统的笔记而言，少了那一份沉浸式的记录和阅读回味的感觉。

所以在这样的背景下，VenusHui's Blog 作为一个 **技术向** 的个人博客网站应运而生。

## 项目架构

### 前端框架

本项目以基于 **React** 的 **Next.js** 作为主要的前端框架

选用 Next.js 的原因：

- Next.js 对于静态资源的加载速度十分迅速，非常适合用于个人博客网站的搭建。默认情况下，Next.js 将 **预渲染** 每个 page（页面）。这意味着 Next.js 会预先为每个页面生成 HTML 文件，而不是由客户端 JavaScript 来完成。预渲染可以带来更好的性能和 SEO 效果。
- Next.js 支持动态路由，路由根据文件路径生成，无需额外配置，利于博文管理。

出于美观性的考虑，本项目使用了 **Tailwind** 作为样式管理工具，**Material UI** 作为 UI 库

- Tailwind 可以对项目采用的 CSS 样式进行集中管理
- Material UI 提供了风格统一且美观的 UI

### 功能实现



### 部署流程

#### GitHub Actions CI/CD

本项目所有博文均采用 GitHub 仓库对所有博文进行管理，并使用 GitHub Actions 提供的工作流进行持续集成：

```yaml
- name: Checkout
  uses: actions/checkout@v2
  with:
    persist-credentials: false

- name: Install Dependencies
  run: |
    echo "Building..."
    yarn install
    yarn export

- name: Login Docker
  uses: docker/login-action@f054a8b539a109f9f41c372932f1ae047eff08c9
    with: 
      username: ${{ secrets.DOCKER_USERNAME }}
      password: ${{ secrets.DOCKER_PASSWORD }}

- name: Extract metadata for Docker
  id: meta
  uses: docker/metadata-action@98669ae865ea3cffbcbaa878cf57c20bbf1c6c38
  with:
    images: VenusHui/VenusHui_blog

- name: Publish Docker Image
  uses: docker/build-push-action@ad44023a93711e3deb337508980b4b5e9bcdc5dc
  with: 
    context: .
     push: true
     tags: ${{ steps.meta.outputs.tags }}
     labels: ${{ steps.meta.outputs.labels }}

- name: Deploy On Tencent Cloud Server
  uses: appleboy/ssh-action@master
  with: 
  	host: ${{ secrets.TENCENT_CLOUD_IP }}
    username: ${{ secrets.TENCENT_CLOUD_USERNAME }}
    password: ${{ secrets.TENCENT_CLOUD_PASSWORD }}
    script: cd ~/Blog && bash deploy.sh ${{ secrets.DOCKER_USERNAME }} ${{ secrets.DOCKER_PASSWORD }} >> ./deploy.log
```

#### Docker

```dockerfile
FROM nginx
COPY ./out /usr/share/nginx/html
EXPOSE 80
```

