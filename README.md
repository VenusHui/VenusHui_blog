# VenusHui's Blog

## 项目地址

可以通过下面的地址直接访问到本博客：

[http://www.venushui.top:1207](http://www.venushui.top:1207)

项目 GitHub 地址：

[https://github.com/VenusHui/VenusHui_blog](https://github.com/VenusHui/VenusHui_blog)

## 项目运行

```shell	
# 克隆项目到本地
git clone https://github.com/VenusHui/VenusHui_blog.git

# 添加依赖
yarn install

# 项目运行，在http://localhost:3000可以从本地访问到本项目
yarn dev

# 项目打包
yarn build && yarn export
```

## 项目背景

早在高中时期就有一个 **记录自己生活** 的想法了，只是那时因为技术以及硬件条件的限制，最终只能以纸笔为载体。

大学之后，纸笔逐渐淡出了我的生活，取而代之的是 PC 以及 iPad 。相应的，自己的日常也从笔记本中走了出来，去到了相册、备忘录、抖音、小红书和B站里，但我总觉得这样的形式缺了点什么，并不是说它们不好，社交属性，庞大的信息流都是它们引以为傲的优势，但也正因为此，它们相比传统的笔记而言，少了那一份沉浸式的记录和阅读回味的感觉。

所以在这样的背景下，VenusHui's Blog 作为一个 **技术向** 的个人博客网站应运而生。

<img src="./README.assets/image-20221224202706548.png" alt="image-20221224202706548" style="zoom:50%;" />

## 项目架构

### 前端框架

本项目以基于 **React** 的 **Next.js** 作为主要的前端框架

选用 Next.js 的原因：

- Next.js 对于静态资源的加载速度十分迅速，非常适合用于个人博客网站的搭建。默认情况下，Next.js 将 **预渲染** 每个 page（页面）。这意味着 Next.js 会预先为每个页面生成 HTML 文件，而不是由客户端 JavaScript 来完成。预渲染可以带来更好的性能和 SEO 效果。

<img src="./README.assets/image-20221225003513083.png" alt="image-20221225003513083" style="zoom:50%;" />

- Next.js 支持动态路由，路由根据文件路径生成，无需额外配置，利于博文管理。

出于美观性的考虑，本项目使用了 **Tailwind** 作为样式管理工具，**Material UI** 作为 UI 库

- Tailwind 可以对项目采用的 CSS 样式进行集中管理
- Material UI 提供了风格统一且美观的 UI

### 功能实现

#### 博文搜索

由于本项目所有博文均采用 GitHub 仓库对所有博文进行管理，所以可以通过 axios 请求 GitHub 提供的 API 在本仓库内根据关键词进行搜索，**关键词可以覆盖全文** 。

<img src="./README.assets/image-20221224202947312.png" alt="image-20221224202947312" style="zoom:50%;" />

```javascript
const instance = axios.create({
  baseURL: 'https://api.github.com',
});

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

<img src="./README.assets/image-20221224203111597.png" alt="image-20221224203111597" style="zoom:50%;" />

由于本项目所有博文均通过 `markdown` 进行编写，所以选择 `next-mdx-remote` 将 `markdown` 文件转换为 `mdx` 文件之后进行渲染，并提取该文件的 `title` 、`description` 、`date` 信息进行博文简略信息的卡片渲染。

```react
<main>
  <article className="prose dark:prose-dark" style={{maxWidth: "60rem"}}>
    <MDXRemote {...source} components={components} />
  </article>
</main>
```

#### 博文发布

首先将写好的博文上传至 GitHub 仓库的 Main 分支下

##### GitHub Actions CI/CD

GitHub Actions 可以监测到 push 动作，并且会自动触发 GitHub Actions 的工作流进行持续集成，工作流 `yaml` 文件如下所示：

<img src="./README.assets/image-20221224202610629.png" alt="image-20221224202610629" style="zoom:50%;" />

```yaml
name: Deployment
runs-on: ubuntu-latest
steps:
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

##### Docker

工作流中将现有代码通过 Docker 打包后发布到 Docker Hub，Dockerfile如下：

<img src="./README.assets/image-20221224203818223.png" alt="image-20221224203818223" style="zoom:50%;" />

```dockerfile
# Dockerfile
FROM nginx
COPY ./out /usr/share/nginx/html
EXPOSE 80
```

##### Tencent OSS

最后执行腾讯云服务器上的 `deploy.sh` 脚本，成功将博文发布到公网，并生成对应日志

<img src="./README.assets/image-20221225004011589.png" alt="image-20221225004011589" style="zoom: 67%;" />

## 项目展望

- 添加博文分类：如笔记、题解、杂谈类别，并添加对应分类的搜索栏
- 添加评论与反馈（正在进行）：通过 MongoDB Atlas 对评论这种非结构化数据进行托管，为笔者和读者提供沟通渠道
