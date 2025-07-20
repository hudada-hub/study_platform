公网： 49.233.182.71  22  
账号： root  
密码： 820035003Tengxunyun


[1Panel Log]: 您设置的面板安全入口是 0b4a88695d 
设置 1Panel 面板用户 (默认是 f9d8fbd027): 
[1Panel Log]: 设置 1Panel 面板密码，设置后按回车键继续 (默认是 4251beff84)


docker run -d --name study_pgsql -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root123456 -e POSTGRES_DB=study_platform -p 5432:5432 postgres:15
数据库迁移命令：npx prisma migrate dev --name init


npx ts-node src/init-admin.ts

prisma generate&&npx prisma db push
git push origin main && git push github main


7月10日开始到8月20日
每个组件，都有自己的属性，
将属性存入数据库中


左侧二级菜单组件列表中，