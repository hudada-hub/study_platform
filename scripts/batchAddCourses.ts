import { CourseLevel, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 方向数据 - 参考图片
const directions = [
  { name: 'UI' },
  { name: '产品' },
  { name: '架构师' },
  { name: '移动端' },
  { name: '运营' },
  { name: '推广' },
  { name: '策划' },
  { name: '音效师' },
  { name: '美术' },
  { name: '配音演员' },
  { name: '3D建模' },
];

// 分类数据 - 参考图片
const categories = [
  { name: '课程分类1' },
  { name: '课程分类2' },
  { name: 'LOI' },
  { name: '王者荣耀' },
  { name: '前端' },
  { name: 'JAVA' },
  { name: 'GO' },
  { name: 'PHP' },
  { name: 'PYTHON' },
  { name: 'C语言' },
  { name: 'C++' },
  { name: '微信小游戏' },
  { name: '微信小程序' },
  { name: 'unreal engine' },
  { name: 'unity pro' },
];

// 课程数据模板
const courseTemplates = [
  {
    title: 'React 18 从入门到精通',
    instructor: '张老师',
    description: '全面学习React 18的新特性，包括Concurrent Features、Suspense、Server Components等，掌握现代前端开发技术。',
    level: 'BEGINNER',
    targetAudience: '零基础学习者、有一定JavaScript基础的开发者',
    courseGoals: '掌握React 18核心概念，能够独立开发复杂的前端应用',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 1250,
    studentCount: 856,
    ratingScore: 4.8,
    totalDuration: 1800, // 30小时
  },
  {
    title: 'Vue.js 3.0 实战开发',
    instructor: '李老师',
    description: '深入学习Vue.js 3.0的Composition API、响应式系统、组件开发等核心知识，构建现代化前端应用。',
    level: 'INTERMEDIATE',
    targetAudience: '有一定前端基础，想要深入学习Vue.js的开发者',
    courseGoals: '熟练使用Vue.js 3.0开发企业级应用，掌握最佳实践',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 2100,
    studentCount: 1203,
    ratingScore: 4.9,
    totalDuration: 2400, // 40小时
  },
  {
    title: 'Node.js 后端开发实战',
    instructor: '王老师',
    description: '从零开始学习Node.js后端开发，包括Express框架、数据库操作、API设计、部署等完整流程。',
    level: 'ADVANCED',
    targetAudience: '有一定JavaScript基础，想要学习后端开发的开发者',
    courseGoals: '能够独立开发完整的后端服务，掌握服务器部署和维护',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 890,
    studentCount: 567,
    ratingScore: 4.7,
    totalDuration: 3000, // 50小时
  },
  {
    title: 'Python 数据分析入门',
    instructor: '陈老师',
    description: '学习Python数据分析基础，包括pandas、numpy、matplotlib等库的使用，掌握数据可视化技能。',
    level: 'BEGINNER',
    targetAudience: '对数据分析感兴趣的初学者，有一定数学基础',
    courseGoals: '能够使用Python进行基础的数据分析和可视化',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 1560,
    studentCount: 1024,
    ratingScore: 4.6,
    totalDuration: 1500, // 25小时
  },
  {
    title: 'Java 企业级开发',
    instructor: '刘老师',
    description: '深入学习Java企业级开发技术，包括Spring Boot、MyBatis、Redis等主流框架和中间件。',
    level: 'ADVANCED',
    targetAudience: '有一定Java基础，想要学习企业级开发的开发者',
    courseGoals: '掌握Java企业级开发技术栈，能够开发高并发、高可用的系统',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 980,
    studentCount: 623,
    ratingScore: 4.8,
    totalDuration: 3600, // 60小时
  },
  {
    title: 'Go 语言微服务开发',
    instructor: '赵老师',
    description: '学习Go语言微服务架构设计，包括gRPC、Docker、Kubernetes等云原生技术。',
    level: 'INTERMEDIATE',
    targetAudience: '有一定编程基础，想要学习Go语言和微服务的开发者',
    courseGoals: '能够使用Go语言设计和实现微服务架构',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 720,
    studentCount: 445,
    ratingScore: 4.9,
    totalDuration: 2700, // 45小时
  },
  {
    title: 'PHP Laravel 框架开发',
    instructor: '孙老师',
    description: '学习PHP Laravel框架开发，掌握MVC架构、数据库操作、API开发等Web开发技能。',
    level: 'INTERMEDIATE',
    targetAudience: '有一定PHP基础，想要学习Laravel框架的开发者',
    courseGoals: '能够使用Laravel框架开发完整的Web应用',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 680,
    studentCount: 389,
    ratingScore: 4.5,
    totalDuration: 2100, // 35小时
  },
  {
    title: 'C++ 游戏开发实战',
    instructor: '周老师',
    description: '学习C++游戏开发技术，包括图形渲染、物理引擎、音效处理等游戏开发核心知识。',
    level: 'ADVANCED',
    targetAudience: '有一定C++基础，想要学习游戏开发的开发者',
    courseGoals: '能够使用C++开发基础的游戏应用',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 450,
    studentCount: 234,
    ratingScore: 4.7,
    totalDuration: 4200, // 70小时
  },
  {
    title: '微信小程序开发',
    instructor: '吴老师',
    description: '学习微信小程序开发，包括页面设计、API调用、云开发等小程序开发全流程。',
    level: 'BEGINNER',
    targetAudience: '想要学习微信小程序开发的初学者',
    courseGoals: '能够独立开发功能完整的微信小程序',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 1890,
    studentCount: 1345,
    ratingScore: 4.8,
    totalDuration: 1800, // 30小时
  },
  {
    title: 'Unity 3D 游戏开发',
    instructor: '郑老师',
    description: '学习Unity 3D游戏开发，包括场景设计、脚本编程、动画制作等游戏开发技能。',
    level: 'INTERMEDIATE',
    targetAudience: '有一定编程基础，想要学习Unity游戏开发的开发者',
    courseGoals: '能够使用Unity开发3D游戏项目',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 560,
    studentCount: 312,
    ratingScore: 4.6,
    totalDuration: 3300, // 55小时
  },
  {
    title: 'UI/UX 设计基础',
    instructor: '钱老师',
    description: '学习UI/UX设计基础理论，包括用户研究、界面设计、交互设计等设计思维。',
    level: 'BEGINNER',
    targetAudience: '对UI/UX设计感兴趣的初学者',
    courseGoals: '掌握基础的设计理论，能够进行简单的界面设计',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 2340,
    studentCount: 1678,
    ratingScore: 4.9,
    totalDuration: 1200, // 20小时
  },
  {
    title: '产品经理实战课程',
    instructor: '冯老师',
    description: '学习产品经理的核心技能，包括需求分析、产品设计、项目管理等产品开发全流程。',
    level: 'INTERMEDIATE',
    targetAudience: '想要转行产品经理或提升产品能力的职场人士',
    courseGoals: '掌握产品经理的核心技能，能够独立负责产品项目',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 1120,
    studentCount: 789,
    ratingScore: 4.7,
    totalDuration: 2400, // 40小时
  },
  {
    title: '系统架构设计',
    instructor: '褚老师',
    description: '学习系统架构设计理论，包括分布式系统、微服务架构、高可用设计等架构师必备技能。',
    level: 'ADVANCED',
    targetAudience: '有一定开发经验，想要学习系统架构的开发者',
    courseGoals: '掌握系统架构设计方法，能够设计高可用的系统架构',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 890,
    studentCount: 456,
    ratingScore: 4.8,
    totalDuration: 3600, // 60小时
  },
  {
    title: '移动端开发入门',
    instructor: '卫老师',
    description: '学习移动端开发基础，包括Android和iOS开发入门，掌握移动应用开发流程。',
    level: 'BEGINNER',
    targetAudience: '想要学习移动端开发的初学者',
    courseGoals: '掌握移动端开发基础，能够开发简单的移动应用',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 1450,
    studentCount: 923,
    ratingScore: 4.6,
    totalDuration: 2100, // 35小时
  },
  {
    title: '数字营销运营',
    instructor: '蒋老师',
    description: '学习数字营销运营策略，包括SEO、SEM、社交媒体营销、内容营销等现代营销技能。',
    level: 'INTERMEDIATE',
    targetAudience: '想要学习数字营销的运营人员',
    courseGoals: '掌握数字营销的核心技能，能够制定有效的营销策略',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 980,
    studentCount: 634,
    ratingScore: 4.5,
    totalDuration: 1800, // 30小时
  },
  {
    title: '游戏策划与设计',
    instructor: '沈老师',
    description: '学习游戏策划与设计理论，包括游戏机制设计、关卡设计、数值平衡等游戏设计核心知识。',
    level: 'INTERMEDIATE',
    targetAudience: '对游戏设计感兴趣，想要学习游戏策划的爱好者',
    courseGoals: '掌握游戏设计基础理论，能够进行简单的游戏策划',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 670,
    studentCount: 389,
    ratingScore: 4.7,
    totalDuration: 2400, // 40小时
  },
  {
    title: '音效制作与处理',
    instructor: '韩老师',
    description: '学习音效制作与处理技术，包括录音、混音、音效设计等音频制作技能。',
    level: 'BEGINNER',
    targetAudience: '对音效制作感兴趣的初学者',
    courseGoals: '掌握基础的音效制作技能，能够制作简单的音效',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 450,
    studentCount: 234,
    ratingScore: 4.4,
    totalDuration: 1500, // 25小时
  },
  {
    title: '数字艺术创作',
    instructor: '杨老师',
    description: '学习数字艺术创作技术，包括数字绘画、3D建模、动画制作等数字艺术技能。',
    level: 'INTERMEDIATE',
    targetAudience: '有一定美术基础，想要学习数字艺术的创作者',
    courseGoals: '掌握数字艺术创作技能，能够创作数字艺术作品',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 780,
    studentCount: 456,
    ratingScore: 4.6,
    totalDuration: 2700, // 45小时
  },
  {
    title: '配音技巧与表演',
    instructor: '朱老师',
    description: '学习配音技巧与表演艺术，包括声音塑造、情感表达、角色配音等配音技能。',
    level: 'BEGINNER',
    targetAudience: '对配音表演感兴趣的初学者',
    courseGoals: '掌握基础配音技巧，能够进行简单的配音表演',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 560,
    studentCount: 312,
    ratingScore: 4.5,
    totalDuration: 1200, // 20小时
  },
  {
    title: '3D建模与渲染',
    instructor: '秦老师',
    description: '学习3D建模与渲染技术，包括建模技巧、材质制作、灯光渲染等3D制作技能。',
    level: 'INTERMEDIATE',
    targetAudience: '有一定美术基础，想要学习3D建模的创作者',
    courseGoals: '掌握3D建模与渲染技能，能够制作3D模型和场景',
    coverUrl: 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/20/4d7a66be-e029-489a-9de3-a8cbe3a90944.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1752995038;1753002238&q-key-time=1752995038;1753002238&q-header-list=host&q-url-param-list=&q-signature=624c7e6b5dc2210060c8283083a604f4cb0e2052',
    viewCount: 890,
    studentCount: 523,
    ratingScore: 4.7,
    totalDuration: 3000, // 50小时
  },
];

async function main() {
  try {
    console.log('开始批量添加课程数据...');

   

    // 3. 获取所有方向和分类
    const allDirections = await prisma.courseDirection.findMany();
    const allCategories = await prisma.courseCategory.findMany();

    // 4. 获取一个默认用户作为上传者
    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      console.error('没有找到用户，请先创建用户');
      return;
    }

    // 5. 添加课程数据
    console.log('添加课程数据...');
    for (const template of courseTemplates) {
      // 随机选择方向和分类
      const randomDirection = allDirections[Math.floor(Math.random() * allDirections.length)];
      const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];

      await prisma.course.create({
        data: {
          ...template,
          level: template.level as CourseLevel,
          
          directionId: randomDirection.id,
          categoryId: randomCategory.id,
          uploaderId: defaultUser.id,
          summary: template.description.substring(0, 100) + '...',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    console.log('批量添加课程数据完成！');
    console.log(`成功添加 ${directions.length} 个方向`);
    console.log(`成功添加 ${categories.length} 个分类`);
    console.log(`成功添加 ${courseTemplates.length} 个课程`);

  } catch (error) {
    console.error('批量添加数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行脚本
main(); 