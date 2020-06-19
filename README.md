<h3 align="center">
    <img src="https://user-images.githubusercontent.com/30767528/80746783-b892d180-8b22-11ea-987a-34624c23ee65.png" alt="Logo" height="400">
</h3>

<h3 align="center">
    Beam up something. Instantly. Anonymously.
</h3>

<br/>

<p align="center">
  <a href="https://github.com/dot-cafe/beam.cafe/actions?query=workflow%3ADeploy"><img
     alt="CD Status"
     src="https://github.com/dot-cafe/beam.cafe/workflows/Deploy/badge.svg"/></a>
  <a href="https://github.com/dot-cafe/beam.cafe/actions?query=workflow%3ACI"><img
     alt="CI Status"
     src="https://github.com/dot-cafe/beam.cafe/workflows/CI/badge.svg"/></a>
  <img alt="Current version"
       src="https://img.shields.io/github/tag/dot-cafe/beam.cafe.svg?color=0A8CFF&label=version">
  <a href="https://github.com/sponsors/Simonwep"><img
     alt="GitHub Sponsors"
     src="https://img.shields.io/badge/GitHub-sponsor-0A5DFF.svg"></a>
  <a href="https://www.buymeacoffee.com/aVc3krbXQ"><img
     alt="Buy me a Coffee"
     src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-donate-FF813F.svg"></a>
  <a href="https://www.patreon.com/simonwep"><img
     alt="Support on Patreon"
     src="https://img.shields.io/badge/Patreon-support-FA8676.svg"></a>
</p>

<p align="center">
    <a href="https://beam.cafe">beam.cafe</a> is a supercharged file-sharing application which lets you share files instantly, fully anonymously and direct.
    <h3 align="center"><a href="https://beam.cafe">Beam Up Something!</a></h3>
</p>


### The concept and Features
beam.cafe knows very little about you - the names of your files, your IP and well, that's it.
If you send over a file it won't get saved somewhere on the server but instead will be streamed from your local machine directly to your peer.
You can always check who's downloading or streaming your files and, in case a link fell into the wrong hands, invalidate a file. Also, beam.cafe comes with a wide set of features:

* 💻 It's a [PWA](https://web.dev/progressive-web-apps/)! You can install it on desktop and on your phone.
* 🌠 Blazing fast - No need to upload your files to unknown servers, your files are served directly from your local machine.
* 🌊 Streamable - Movies, large pictures or just a large audio-file? Stream it instead of downloading all of it!
* 🎁 Tiny - Beam Cafe only uses libraries with a minimal footprint such as [preact](https://preactjs.com/), [graceful-ws](https://github.com/Simonwep/graceful-ws) and [nanopop](https://github.com/Simonwep/nanopop).
* 🔧 Customizable - Many settings around security, appearance, notifications and more!
* 🌜 Multi-themed - Light theme or dark theme? beam.cafe has both, even a high-contrast mode.
* 🦾 Accessible - High contrast theme paired with modern aria-labels will make using it an ease (PR's are welcome!).
* ✨ Modern - A modern design makes using beam.cafe a breeze.


### Local setup
You'll need both the [frontend](https://github.com/dot-cafe/beam.cafe) and [backend](https://github.com/dot-cafe/beam.cafe.backend) to work on it:

```sh

# Clone repositories
git clone https://github.com/dot-cafe/beam.cafe
git clone https://github.com/dot-cafe/beam.cafe.backend

# Install and start both the front- and backend
cd beam.cafe && npm install && npm run dev
cd ../beam.cafe.backend && npm install && npm run dev
```

The API will listen on port `8080` and the front-end will be served from `3000`, make sure these ports are open on your machine.


### Screenshots
> ... or just [try it out](https://beam.cafe/)!

![beam cafe - front](https://user-images.githubusercontent.com/30767528/84598299-057bfe80-ae6a-11ea-9605-5151ec71b214.png)
![beam cafe - files](https://user-images.githubusercontent.com/30767528/84598295-044ad180-ae6a-11ea-901f-1b5195dc2430.png)
![beam cafe - uploads](https://user-images.githubusercontent.com/30767528/84598297-04e36800-ae6a-11ea-97b9-d88fc53cd204.png)
![beam cafe - appearance](https://user-images.githubusercontent.com/30767528/84598300-06149500-ae6a-11ea-8267-e824c6e55dde.png)
![beam cafe - notifications](https://user-images.githubusercontent.com/30767528/84598294-03b23b00-ae6a-11ea-97e6-4d497c666e53.png)


### Funding
Maintaining a beaming cafe costs time and, although very little thanks to concept of beam.cafe, money. If you want you can support me on [GitHub](https://github.com/sponsors/Simonwep), [Patreon](https://www.patreon.com/simonwep), or you could [buy me a coffee](https://www.buymeacoffee.com/aVc3krbXQ).


### Contributing
You've found a bug, have an idea for a future or want to make a PR? Check out our [contribution guidelines](https://github.com/dot-cafe/beam.cafe/blob/master/.github/CONTRIBUTING.md) to get started!


### Production ready?
You want to set up your own beaming station? Head over to [beam.cafe.sh](https://github.com/dot-cafe/beam.cafe.sh) to find instructions of how beam.cafe can be deployed using [nginx](https://nginx.org/)!

---

<p align="center">
Many thanks to  <a href="https://icons8.com">icons8</a> for the icons!<br/>
Special thanks to  <a href="https://github.com/NateSeymour">Nathan S.</a> for finding a name for this app!
</p>
