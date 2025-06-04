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

## 要素の編集

描画後の点や線は以下のグローバル関数で編集できます。

- `editPoint(index, x, y)`: `index` 番目の点を新しい座標 `(x, y)` に移動します。
- `editLine(index, x1, y1, x2, y2)`: `index` 番目の線を新しい始点 `(x1, y1)`、終点 `(x2, y2)` に変更します。

編集後は自動的にキャンバスが再描画されます。
