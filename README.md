# ConnecTouch Signage for ORF2017

http://connectouch.org

ORF2017デモ展示用のサイネージシステム


## 構成
Gulp + jQuery + Browserify + Babel


## 使い方

`index.html`を開くだけ

現場ですぐ使えるように、`bundle.js`や`style.css`はignoreしておりません。



## 回答の変更
本当は、app.jsを編集してbuildしてほしいが、無理な場合は、
bundle.jsを直接編集する。
54行目あたりの
```js
var POSTER_IDS = [{ id: 'hikarupi1', contentURL: './Pages/a1.html' }, { id: 'hikarupi2', contentURL: './Pages/a2.html' }, { id: 'hikarupi3', contentURL: './Pages/a3.html' }];
```
を編集する。
あとは理解してくれ。とりあえず寝る。



## 開発

依存ファイルの解決
```
$ npm install

```

Browserify + Babelの実行
```
$ gulp browserify
```

SCSSの変換
```
$ gulp sass
```

ファイルの監視と自動変換
```
$ gulp watch
```