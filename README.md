



# Service Status

> 一个基于NodeJS的服务检测工具 可以添加配置文件来展示服务状态和通过WebHook或邮件来提醒


## 预览

![预览图](https://ooo.0o0.ooo/2016/09/25/57e7c490e1416.png)


## 如何使用

``` shell
git clone https://github.com/Srar/ServiceStatus.git
cd ServiceStatus
npm install && npm run build && npm run start
```

> 当控制台输出 `Listening port: 3000` 时说明服务已经成功启动 访问http://ip:3000即可访问



## 如何增加服务配置文件

build/targets文件夹内添加json文件, 添加并编辑完毕后重启服务即可.

> Icon: 网页上标识的图标 请访问 http://fontawesome.io/icons/ 查询
>
> Name: 网页上标识出的监控名
>
> Service: 使用那个服务监控
>
> Target: 任意Object由Service加载 一般为传递给Service的配置
>
> NormalMessage(可选): 当服务正常时的输出 {} 为Service输出变量 请参照Service源码
>
> WarningMessage(可选): 当服务不稳定时的输出 {} 为Service输出变量 请参照Service源码
>
> ErrorMessage(可选): 当服务错误时的输出 {} 为Service输出变量 请参照Service源码
>
> WarningLimit: 监控项超过WarningLimit时触发Warning
>
> ErrorLimit: 监控项超过WarningLimit时触发Warning
>
> CheckTimer: 监控间隔 单位秒
>
>  OtherSettings(可选): 服务插件调用的配置信息

```jso
{
    "Icon": "paper-plane",
    "Name": "Shadowsocks",
    "Service": "HttpProxy",
    "Target": {
        "host": "192.168.0.250",
        "port": 9257
    },
    "NormalMessage": "{time}ms",
    "WarningMessage": "",
    "ErrorMessage": "",
    "WarningLimit": 5,
    "ErrorLimit": 10,
    "CheckTimer": 1,
    "OtherSettings": {
      
    }
}
```



## 目前支持的服务

* Ping4

> 输出变量: {time} {error}

```json
"Target": {
    "host": "192.168.0.210"
},
```

* HttpProxy

> 输出变量: {time} {error}

```json
"Target": {
    "host": "192.168.0.250",
    "port": 9257
},
```

* TcpConnect 

> 输出变量: {time} {error}

```json
"Target": {
    "host": "192.168.0.210",
    "port": 3306
},
```

* HttpGet

> 输出变量: {time} {error}

```json
"Target": {
    "url": "https://github.com"
},
```

## 如何开启邮件提醒
将email.config.default.json更名为email.config.json
> ReportEmail 需要发送服务异常的邮箱
>
> EmailHost SMTP服务器
>
> EmailAccount SMTP帐号
>
> EmailPassword SMTP密码
>
> 在需要异常报告服务target中OtherSettings中加入 ```"ReportEmail": false ```

<b> 邮件服务使用我本人架设的 <a href="https://github.com/Srar/HTTPPostman">HTTPPostman</a> 您可以clone源码自行架设</b>
## 添加服务

* 实现IService接口 
* _Services loadServices方法种加入您的服务
* 服务名为服务的类名
* 项目使用 [Flow](https://flowtype.org/) 类型检测 

