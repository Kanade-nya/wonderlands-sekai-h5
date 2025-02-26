# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


54.9 emu:
https://mall.bilibili.com/neul-next/index.html?page=magic-market_detail&noTitleBar=1&itemsId=140065030416&from=market_index


重启 flask:
nohup gunicorn -w 4 --bind 0.0.0.0:5000 --reload manager:app --timeout 120 --access-logfile - --error-logfile - &


```python

# 定义允许的域名
map $http_origin $cors_origin {
    default "";
    "~^http://192.168.3.194:8080$" $http_origin;
    "~^https://wonderlands-sekai.space$" $http_origin;
    "~^http://wonderlands-sekai.space$" $http_origin;
}
```
nohup命令：

```shell
nohup gunicorn -w 8 --bind 0.0.0.0:5000  --timeout 120  manager:app   > service.log 2>&1 &
cat /dev/null > nohup.out


关闭命令：
pkill -f .sh

nohup uwsgi --http :5000 --wsgi-file manager.py --callable app > uwsgi.log 2>&1 &

查端口：
sudo lsof -i :5000
```


[ 'https://pjsk-image-1304757492.cos.ap-chengdu.myqcloud.com/image_storage/30ccc3bdd8269f397ec53e54a8b5b2cc.jpg','https://pjsk-image-1304757492.cos.ap-chengdu.myqcloud.com/image_storage/2819c5259bea9796d38df8a2dd608018.jpg']


nohup uvicorn main:app --reload  > service.log 2>&1 &