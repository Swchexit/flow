## 作品 流flow


#### 執行方法
首先，將這份作業clone下來，並且打開ambient_sound資料夾(/flow/ambient_sound)中的main.pd，記得開啟pd的dsp功能

接下來，要開啟local python server，才能在localhost上使用p5.js套件

在此project的根目錄(/flow)下
```
python3 -m http.server
```

最後開啟用來在p5.js及pd間傳遞訊息的小server poster.py
，一樣在project的根目錄下(/flow)
```
python3 poster.py
```

此時，用browser打開localhost:8000 並點一下畫面即可看到作品
