## 合集功能

### api: 添加合集

post:

| name       | ids               |   |   |   |   |
|------------|-------------------|---|---|---|---|
| string     | List              |   |   |   |   |
| e.g:' 合集1' | e.g: [1111,22222] |   |   |   |   |
| 合集名称       | 包含的id列表           |   |   |   |   |

### api2: 获得合集数据

get

```json
{
  "total": '12',
  "list": [
    {
      "id": 1111,
      "name": '合集1',
      "ids": [
        1111,
        22222
      ]
    }
  ]
}
```

## 登录模块

### api: register

post:

| email  | name     | password | code   | |
|--------|----------|----------|--------|-|
| string | string   | string   | string | |
| 邮箱     | nickname | 密码       | 验证码    | |

response:
成功信息，以及返回token
失败信息，验证码错误

发送验证码：
post:
| email | 邮箱
生成一段验证码并发送给对应邮箱，验证码有效时间5分钟

### api: login

post :
| email | password |

response:
成功信息，用户 token
或者 返回失败

### api: 返回用户信息

post :
| token | 用户token
|time|时间戳

## 合集功能

### 数据库表结构

| 名字   | 类型     | 备注   |   
|------|--------|------|
| id   | Number | 自增id |
| Name | String | 合集名称 |  

### api1: 新建合集
