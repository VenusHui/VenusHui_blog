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

#### 博文搜索

由于本项目所有博文均采用 GitHub 仓库对所有博文进行管理，所以可以通过 axios 请求 GitHub 提供的 API 在本仓库内根据关键词进行搜索。

```javascript
const response = await instance.get('/search/code', {
  params: {
    q: query + "+repo:VenusHui/VenusHui_blog/posts/"
      },
  auth: {
    username: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_PASSWORD,
  },
});
```

#### 博文渲染

由于本项目所有博文均通过 `markdown` 进行编写，所以选择 `next-mdx-remote` 将 `markdown` 文件转换为 `mdx` 文件之后进行渲染，并提取该文件的 `title` 、`description` 、`date` 信息进行博文简略信息的卡片渲染。

### 部署流程

#### GitHub Actions CI/CD

本项目所有博文均采用 GitHub 仓库对所有博文进行管理，并使用 GitHub Actions 提供的工作流进行持续集成：

```yaml
- name: Checkout

- name: Install Dependencies

- name: Login Docker

- name: Extract metadata for Docker

- name: Publish Docker Image

- name: Deploy On Tencent Cloud Server
```

#### Docker

```dockerfile
FROM nginx
COPY ./out /usr/share/nginx/html
EXPOSE 80
```

