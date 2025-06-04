# sandbox99

シンプルな作画スクリプトのデモです。

`index.html` をブラウザで開き、テキストエリアに以下のようなスクリプトを入力して `実行` ボタンを押すと、キャンバスに描画されます。

```
point start abs 250 250
repeat 5
  line edge 80 rel 72
end
```

- `point <label> abs <x> <y>`: 絶対座標に点を配置します。
- `point <label> rel <dx> <dy>`: 直前の点からの相対座標に点を配置します。
- `line <label> <length> abs <angle>`: 現在位置から長さと絶対角度で線を引きます。
- `line <label> <length> rel <angle>`: 現在位置から長さと前回角度からの相対角度で線を引きます。
- `repeat <n>` ... `end`: ブロックを n 回繰り返します。

同じラベルの要素は同じ色で描画されます。
