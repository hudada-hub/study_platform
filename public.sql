/*
 Navicat Premium Data Transfer

 Source Server         : 服务器数据库
 Source Server Type    : PostgreSQL
 Source Server Version : 150013
 Source Host           : 49.233.182.71:5433
 Source Catalog        : study_platform
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150013
 File Encoding         : 65001

 Date: 15/08/2025 15:37:51
*/


-- ----------------------------
-- Type structure for ArticleStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."ArticleStatus";
CREATE TYPE "public"."ArticleStatus" AS ENUM (
  'DRAFT',
  'PUBLISHED'
);
ALTER TYPE "public"."ArticleStatus" OWNER TO "root";

-- ----------------------------
-- Type structure for ConfigType
-- ----------------------------
DROP TYPE IF EXISTS "public"."ConfigType";
CREATE TYPE "public"."ConfigType" AS ENUM (
  'TEXT',
  'TEXTAREA',
  'IMAGE',
  'MULTI_IMAGE',
  'MULTI_TEXT',
  'MULTI_CONTENT',
  'RICH_TEXT'
);
ALTER TYPE "public"."ConfigType" OWNER TO "root";

-- ----------------------------
-- Type structure for CourseLevel
-- ----------------------------
DROP TYPE IF EXISTS "public"."CourseLevel";
CREATE TYPE "public"."CourseLevel" AS ENUM (
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'ELEMENTARY',
  'EXPERT'
);
ALTER TYPE "public"."CourseLevel" OWNER TO "root";

-- ----------------------------
-- Type structure for CourseStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."CourseStatus";
CREATE TYPE "public"."CourseStatus" AS ENUM (
  'COMPLETED',
  'ONGOING'
);
ALTER TYPE "public"."CourseStatus" OWNER TO "root";

-- ----------------------------
-- Type structure for GameRegistrationStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."GameRegistrationStatus";
CREATE TYPE "public"."GameRegistrationStatus" AS ENUM (
  'REGISTERED',
  'CANCELLED',
  'COMPLETED'
);
ALTER TYPE "public"."GameRegistrationStatus" OWNER TO "root";

-- ----------------------------
-- Type structure for GameStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."GameStatus";
CREATE TYPE "public"."GameStatus" AS ENUM (
  'ACTIVE',
  'DELETED'
);
ALTER TYPE "public"."GameStatus" OWNER TO "root";

-- ----------------------------
-- Type structure for OrderStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."OrderStatus";
CREATE TYPE "public"."OrderStatus" AS ENUM (
  'PENDING',
  'PAID',
  'CANCELLED',
  'REFUNDED',
  'FAILED'
);
ALTER TYPE "public"."OrderStatus" OWNER TO "root";

-- ----------------------------
-- Type structure for OrderType
-- ----------------------------
DROP TYPE IF EXISTS "public"."OrderType";
CREATE TYPE "public"."OrderType" AS ENUM (
  'COURSE',
  'RECHARGE',
  'TASK'
);
ALTER TYPE "public"."OrderType" OWNER TO "root";

-- ----------------------------
-- Type structure for PaymentMethod
-- ----------------------------
DROP TYPE IF EXISTS "public"."PaymentMethod";
CREATE TYPE "public"."PaymentMethod" AS ENUM (
  'ALIPAY',
  'WECHAT',
  'BALANCE'
);
ALTER TYPE "public"."PaymentMethod" OWNER TO "root";

-- ----------------------------
-- Type structure for PermissionType
-- ----------------------------
DROP TYPE IF EXISTS "public"."PermissionType";
CREATE TYPE "public"."PermissionType" AS ENUM (
  'READ',
  'WRITE',
  'DELETE',
  'ADMIN'
);
ALTER TYPE "public"."PermissionType" OWNER TO "root";

-- ----------------------------
-- Type structure for PostStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."PostStatus";
CREATE TYPE "public"."PostStatus" AS ENUM (
  'PENDING',
  'PUBLISHED',
  'REJECTED',
  'DRAFT',
  'DELETED'
);
ALTER TYPE "public"."PostStatus" OWNER TO "root";

-- ----------------------------
-- Type structure for TaskStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."TaskStatus";
CREATE TYPE "public"."TaskStatus" AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED',
  'IN_PROGRESS',
  'COMPLETED',
  'ADMIN_CONFIRMED',
  'PUBLISHER_CONFIRMED',
  'WITHDRAW_REQUESTED',
  'WITHDRAW_SUCCESS',
  'WITHDRAW_FAILED'
);
ALTER TYPE "public"."TaskStatus" OWNER TO "root";

-- ----------------------------
-- Type structure for UserRole
-- ----------------------------
DROP TYPE IF EXISTS "public"."UserRole";
CREATE TYPE "public"."UserRole" AS ENUM (
  'USER',
  'SUPER_ADMIN',
  'ADMIN'
);
ALTER TYPE "public"."UserRole" OWNER TO "root";

-- ----------------------------
-- Type structure for UserStatus
-- ----------------------------
DROP TYPE IF EXISTS "public"."UserStatus";
CREATE TYPE "public"."UserStatus" AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'DELETED'
);
ALTER TYPE "public"."UserStatus" OWNER TO "root";

-- ----------------------------
-- Type structure for WatermarkPosition
-- ----------------------------
DROP TYPE IF EXISTS "public"."WatermarkPosition";
CREATE TYPE "public"."WatermarkPosition" AS ENUM (
  'FULLSCREEN',
  'MOVING',
  'TOP_LEFT',
  'TOP_RIGHT',
  'CENTER',
  'BOTTOM_RIGHT',
  'BOTTOM_LEFT'
);
ALTER TYPE "public"."WatermarkPosition" OWNER TO "root";

-- ----------------------------
-- Sequence structure for ArticleCategory_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ArticleCategory_id_seq";
CREATE SEQUENCE "public"."ArticleCategory_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ArticleCommentLike_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ArticleCommentLike_id_seq";
CREATE SEQUENCE "public"."ArticleCommentLike_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ArticleComment_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ArticleComment_id_seq";
CREATE SEQUENCE "public"."ArticleComment_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for Article_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Article_id_seq";
CREATE SEQUENCE "public"."Article_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ConfigImageValue_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ConfigImageValue_id_seq";
CREATE SEQUENCE "public"."ConfigImageValue_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ConfigMultiContentValue_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ConfigMultiContentValue_id_seq";
CREATE SEQUENCE "public"."ConfigMultiContentValue_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ConfigMultiImageValue_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ConfigMultiImageValue_id_seq";
CREATE SEQUENCE "public"."ConfigMultiImageValue_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ConfigMultiTextValue_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ConfigMultiTextValue_id_seq";
CREATE SEQUENCE "public"."ConfigMultiTextValue_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ConfigTextValue_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ConfigTextValue_id_seq";
CREATE SEQUENCE "public"."ConfigTextValue_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for Config_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Config_id_seq";
CREATE SEQUENCE "public"."Config_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for CourseCategory_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."CourseCategory_id_seq";
CREATE SEQUENCE "public"."CourseCategory_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for CourseChapterLog_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."CourseChapterLog_id_seq";
CREATE SEQUENCE "public"."CourseChapterLog_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for CourseChapter_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."CourseChapter_id_seq";
CREATE SEQUENCE "public"."CourseChapter_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for CourseCommentLike_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."CourseCommentLike_id_seq";
CREATE SEQUENCE "public"."CourseCommentLike_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for CourseComment_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."CourseComment_id_seq";
CREATE SEQUENCE "public"."CourseComment_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for CourseDirection_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."CourseDirection_id_seq";
CREATE SEQUENCE "public"."CourseDirection_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for CourseFavorite_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."CourseFavorite_id_seq";
CREATE SEQUENCE "public"."CourseFavorite_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for CourseLike_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."CourseLike_id_seq";
CREATE SEQUENCE "public"."CourseLike_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for CourseRating_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."CourseRating_id_seq";
CREATE SEQUENCE "public"."CourseRating_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for Course_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Course_id_seq";
CREATE SEQUENCE "public"."Course_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumCategory_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumCategory_id_seq";
CREATE SEQUENCE "public"."ForumCategory_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumCommentDislike_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumCommentDislike_id_seq";
CREATE SEQUENCE "public"."ForumCommentDislike_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumCommentLike_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumCommentLike_id_seq";
CREATE SEQUENCE "public"."ForumCommentLike_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumCommentReport_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumCommentReport_id_seq";
CREATE SEQUENCE "public"."ForumCommentReport_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumComment_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumComment_id_seq";
CREATE SEQUENCE "public"."ForumComment_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumPostFavorite_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumPostFavorite_id_seq";
CREATE SEQUENCE "public"."ForumPostFavorite_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumPostLike_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumPostLike_id_seq";
CREATE SEQUENCE "public"."ForumPostLike_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumPostReport_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumPostReport_id_seq";
CREATE SEQUENCE "public"."ForumPostReport_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumPost_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumPost_id_seq";
CREATE SEQUENCE "public"."ForumPost_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumSectionFavorite_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumSectionFavorite_id_seq";
CREATE SEQUENCE "public"."ForumSectionFavorite_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for ForumSection_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."ForumSection_id_seq";
CREATE SEQUENCE "public"."ForumSection_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for GameRegistration_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."GameRegistration_id_seq";
CREATE SEQUENCE "public"."GameRegistration_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for Game_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Game_id_seq";
CREATE SEQUENCE "public"."Game_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for Permission_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Permission_id_seq";
CREATE SEQUENCE "public"."Permission_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for RegisterOrder_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."RegisterOrder_id_seq";
CREATE SEQUENCE "public"."RegisterOrder_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for RolePermission_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."RolePermission_id_seq";
CREATE SEQUENCE "public"."RolePermission_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for Role_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Role_id_seq";
CREATE SEQUENCE "public"."Role_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for SystemNotification_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."SystemNotification_id_seq";
CREATE SEQUENCE "public"."SystemNotification_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for TaskApplication_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."TaskApplication_id_seq";
CREATE SEQUENCE "public"."TaskApplication_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for TaskAssignment_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."TaskAssignment_id_seq";
CREATE SEQUENCE "public"."TaskAssignment_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for TaskCategory_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."TaskCategory_id_seq";
CREATE SEQUENCE "public"."TaskCategory_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for TaskCommentLike_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."TaskCommentLike_id_seq";
CREATE SEQUENCE "public"."TaskCommentLike_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for TaskComment_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."TaskComment_id_seq";
CREATE SEQUENCE "public"."TaskComment_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for TaskFavorite_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."TaskFavorite_id_seq";
CREATE SEQUENCE "public"."TaskFavorite_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for TaskLike_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."TaskLike_id_seq";
CREATE SEQUENCE "public"."TaskLike_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for Task_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Task_id_seq";
CREATE SEQUENCE "public"."Task_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for UserMessage_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."UserMessage_id_seq";
CREATE SEQUENCE "public"."UserMessage_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for UserRoleRelation_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."UserRoleRelation_id_seq";
CREATE SEQUENCE "public"."UserRoleRelation_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for User_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."User_id_seq";
CREATE SEQUENCE "public"."User_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for WithdrawRecord_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."WithdrawRecord_id_seq";
CREATE SEQUENCE "public"."WithdrawRecord_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for Article
-- ----------------------------
DROP TABLE IF EXISTS "public"."Article";
CREATE TABLE "public"."Article" (
  "id" int4 NOT NULL DEFAULT nextval('"Article_id_seq"'::regclass),
  "title" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "summary" text COLLATE "pg_catalog"."default",
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "coverUrl" varchar(500) COLLATE "pg_catalog"."default",
  "viewCount" int4 NOT NULL DEFAULT 0,
  "likeCount" int4 NOT NULL DEFAULT 0,
  "commentCount" int4 NOT NULL DEFAULT 0,
  "status" "public"."ArticleStatus" NOT NULL DEFAULT 'DRAFT'::"ArticleStatus",
  "categoryId" int4 NOT NULL,
  "authorId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of Article
-- ----------------------------
INSERT INTO "public"."Article" VALUES (1, '用户协议', NULL, '<h1 style="text-align: start;">用户协议</h1><p><br></p><p>欢迎使用我们的服务！</p><h2>1. 协议的范围</h2><p>本协议是您与平台之间关于使用平台服务所订立的协议。</p><h2>2. 账号注册</h2><p>您承诺提供真实、准确、完整的注册信息。</p><h2>3. 用户行为规范</h2><p>您在使用服务时需遵守相关法律法规。</p>', NULL, 0, 0, 0, 'PUBLISHED', 1, 1, '2025-08-15 01:36:14.533', '2025-08-15 01:36:14.533');
INSERT INTO "public"."Article" VALUES (3, '用户隐私协议', NULL, '<h1 style="text-align: start;">用户隐私协议</h1><p><br></p><h2>1. 信息收集</h2><p>我们收集的信息类型及其用途。</p><h2>2. 信息使用</h2><p>我们如何使用和保护您的个人信息。</p><h2>3. 信息共享</h2><p>在何种情况下我们会共享您的信息。</p>', NULL, 21, 0, 0, 'PUBLISHED', 1, 1, '2025-08-15 01:38:27.33', '2025-08-15 02:15:31.044');
INSERT INTO "public"."Article" VALUES (4, '用户付费协议', NULL, '<h1 style="text-align: start;">用户付费协议</h1><p><br></p><h2>1. 付费内容</h2><p>关于平台付费内容的说明。</p><h2>2. 支付方式</h2><p>支持的支付方式及流程说明。</p><h2>3. 退款政策</h2><p>关于退款的政策说明。</p>', NULL, 21, 0, 0, 'PUBLISHED', 1, 1, '2025-08-15 01:39:05.025', '2025-08-15 02:15:36.483');
INSERT INTO "public"."Article" VALUES (2, '版权与免责声明', NULL, '<h1 style="text-align: start;">版权与免责声明</h1><p><br></p><h2>1. 知识产权声明</h2><p>平台上的所有内容均受著作权法及其他相关法律法规的保护。</p><h2>2. 免责声明</h2><p>平台不对用户发布的内容承担责任。</p>', NULL, 9, 0, 0, 'PUBLISHED', 1, 1, '2025-08-15 01:38:02.265', '2025-08-15 02:10:52.756');

-- ----------------------------
-- Table structure for ArticleCategory
-- ----------------------------
DROP TABLE IF EXISTS "public"."ArticleCategory";
CREATE TABLE "public"."ArticleCategory" (
  "id" int4 NOT NULL DEFAULT nextval('"ArticleCategory_id_seq"'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "sort" int4 NOT NULL DEFAULT 0,
  "isEnabled" bool NOT NULL DEFAULT true,
  "parentId" int4,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of ArticleCategory
-- ----------------------------
INSERT INTO "public"."ArticleCategory" VALUES (1, '协议', NULL, 0, 't', NULL, '2025-08-15 01:30:30.115', '2025-08-15 01:30:30.115');

-- ----------------------------
-- Table structure for ArticleComment
-- ----------------------------
DROP TABLE IF EXISTS "public"."ArticleComment";
CREATE TABLE "public"."ArticleComment" (
  "id" int4 NOT NULL DEFAULT nextval('"ArticleComment_id_seq"'::regclass),
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isActive" bool NOT NULL DEFAULT true,
  "likeCount" int4 NOT NULL DEFAULT 0,
  "isDeleted" bool NOT NULL DEFAULT false,
  "userId" int4 NOT NULL,
  "articleId" int4,
  "parentCommentId" int4
)
;

-- ----------------------------
-- Records of ArticleComment
-- ----------------------------

-- ----------------------------
-- Table structure for ArticleCommentLike
-- ----------------------------
DROP TABLE IF EXISTS "public"."ArticleCommentLike";
CREATE TABLE "public"."ArticleCommentLike" (
  "id" int4 NOT NULL DEFAULT nextval('"ArticleCommentLike_id_seq"'::regclass),
  "commentId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of ArticleCommentLike
-- ----------------------------

-- ----------------------------
-- Table structure for Config
-- ----------------------------
DROP TABLE IF EXISTS "public"."Config";
CREATE TABLE "public"."Config" (
  "id" int4 NOT NULL DEFAULT nextval('"Config_id_seq"'::regclass),
  "key" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "type" "public"."ConfigType" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "sort" int4 NOT NULL DEFAULT 0,
  "isEnabled" bool NOT NULL DEFAULT true,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of Config
-- ----------------------------
INSERT INTO "public"."Config" VALUES (1, 'forum_carousel', '论坛轮播图', 'MULTI_CONTENT', '论坛轮播图', 0, 't', '2025-07-26 09:48:10.261', '2025-07-26 09:48:10.261');

-- ----------------------------
-- Table structure for ConfigImageValue
-- ----------------------------
DROP TABLE IF EXISTS "public"."ConfigImageValue";
CREATE TABLE "public"."ConfigImageValue" (
  "id" int4 NOT NULL DEFAULT nextval('"ConfigImageValue_id_seq"'::regclass),
  "configId" int4 NOT NULL,
  "url" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "link" varchar(500) COLLATE "pg_catalog"."default",
  "alt" varchar(200) COLLATE "pg_catalog"."default",
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of ConfigImageValue
-- ----------------------------

-- ----------------------------
-- Table structure for ConfigMultiContentValue
-- ----------------------------
DROP TABLE IF EXISTS "public"."ConfigMultiContentValue";
CREATE TABLE "public"."ConfigMultiContentValue" (
  "id" int4 NOT NULL DEFAULT nextval('"ConfigMultiContentValue_id_seq"'::regclass),
  "configId" int4 NOT NULL,
  "title" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "contentEn" text COLLATE "pg_catalog"."default",
  "imageUrl" varchar(500) COLLATE "pg_catalog"."default",
  "link" varchar(500) COLLATE "pg_catalog"."default",
  "alt" varchar(200) COLLATE "pg_catalog"."default",
  "sort" int4 NOT NULL DEFAULT 0,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of ConfigMultiContentValue
-- ----------------------------
INSERT INTO "public"."ConfigMultiContentValue" VALUES (1, 1, '轮播图论坛1', '轮播图论坛1', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/26/2594ac87-b432-4686-af8c-d001ba5ad0ba.jpeg?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1753523268;1753530468&q-key-time=1753523268;1753530468&q-header-list=host&q-url-param-list=&q-signature=4e0ab00cad6c2bc7109e2f214609b4dccadd1ce2', 'https://example.com/bluebird', NULL, 0, '2025-07-26 09:48:10.313');
INSERT INTO "public"."ConfigMultiContentValue" VALUES (2, 1, '轮播图论坛2', '轮播图论坛2', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/26/f2f9e0ab-1744-4e15-aeef-cc6299540232.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1753523288;1753530488&q-key-time=1753523288;1753530488&q-header-list=host&q-url-param-list=&q-signature=d17d18b26cf4e9b6bf42d52f68b1244346102bdc', 'https://baidu.com', NULL, 1, '2025-07-26 09:48:10.313');

-- ----------------------------
-- Table structure for ConfigMultiImageValue
-- ----------------------------
DROP TABLE IF EXISTS "public"."ConfigMultiImageValue";
CREATE TABLE "public"."ConfigMultiImageValue" (
  "id" int4 NOT NULL DEFAULT nextval('"ConfigMultiImageValue_id_seq"'::regclass),
  "configId" int4 NOT NULL,
  "url" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "link" varchar(500) COLLATE "pg_catalog"."default",
  "alt" varchar(200) COLLATE "pg_catalog"."default",
  "sort" int4 NOT NULL DEFAULT 0,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of ConfigMultiImageValue
-- ----------------------------

-- ----------------------------
-- Table structure for ConfigMultiTextValue
-- ----------------------------
DROP TABLE IF EXISTS "public"."ConfigMultiTextValue";
CREATE TABLE "public"."ConfigMultiTextValue" (
  "id" int4 NOT NULL DEFAULT nextval('"ConfigMultiTextValue_id_seq"'::regclass),
  "configId" int4 NOT NULL,
  "title" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "contentEn" text COLLATE "pg_catalog"."default",
  "link" varchar(500) COLLATE "pg_catalog"."default",
  "sort" int4 NOT NULL DEFAULT 0,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of ConfigMultiTextValue
-- ----------------------------

-- ----------------------------
-- Table structure for ConfigTextValue
-- ----------------------------
DROP TABLE IF EXISTS "public"."ConfigTextValue";
CREATE TABLE "public"."ConfigTextValue" (
  "id" int4 NOT NULL DEFAULT nextval('"ConfigTextValue_id_seq"'::regclass),
  "configId" int4 NOT NULL,
  "value" text COLLATE "pg_catalog"."default" NOT NULL,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of ConfigTextValue
-- ----------------------------

-- ----------------------------
-- Table structure for Course
-- ----------------------------
DROP TABLE IF EXISTS "public"."Course";
CREATE TABLE "public"."Course" (
  "id" int4 NOT NULL DEFAULT nextval('"Course_id_seq"'::regclass),
  "title" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "coverUrl" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "summary" text COLLATE "pg_catalog"."default",
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "instructor" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "viewCount" int4 NOT NULL DEFAULT 0,
  "studentCount" int4 NOT NULL DEFAULT 0,
  "directionId" int4 NOT NULL,
  "level" "public"."CourseLevel" NOT NULL,
  "status" "public"."CourseStatus" NOT NULL DEFAULT 'ONGOING'::"CourseStatus",
  "episodeCount" int4 NOT NULL DEFAULT 0,
  "totalDuration" int4 NOT NULL DEFAULT 0,
  "tags" text[] COLLATE "pg_catalog"."default",
  "targetAudience" text COLLATE "pg_catalog"."default" NOT NULL,
  "ratingScore" float8 NOT NULL DEFAULT 100,
  "likeCount" int4 NOT NULL DEFAULT 0,
  "favoriteCount" int4 NOT NULL DEFAULT 0,
  "courseGoals" text COLLATE "pg_catalog"."default" NOT NULL,
  "isTop" bool NOT NULL DEFAULT false,
  "isDeleted" bool NOT NULL DEFAULT false,
  "isHidden" bool NOT NULL DEFAULT false,
  "categoryId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "uploaderId" int4 NOT NULL,
  "oneTimePayment" bool NOT NULL DEFAULT false,
  "courseware" jsonb,
  "oneTimePoint" int4 NOT NULL DEFAULT 0
)
;

-- ----------------------------
-- Records of Course
-- ----------------------------
INSERT INTO "public"."Course" VALUES (33, '范德萨发2', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/9cf89869-0181-4130-9ef4-9a69413fbec3.png', '范德萨发撒发方', '范德萨发撒发方', '434', 12, 0, 4, 'ELEMENTARY', 'ONGOING', 1, 189, NULL, '范德萨发撒的阿发艾师傅', 100, 0, 0, '发达是的发生方', 'f', 'f', 'f', 4, '2025-08-13 07:58:32.307', '2025-08-14 06:31:30.606', 1, 'f', '[]', 0);
INSERT INTO "public"."Course" VALUES (31, '大章节可以一次性支付', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/12/b3132f5f-b8b9-4db2-92bd-af1f9188d291.png', '一次性一次性一次性', '一次性一次性一次性', '一次性', 400, 0, 3, 'ADVANCED', 'ONGOING', 1, 3477, NULL, '一次性一次性一次性一次性', 100, 0, 0, '一次性一次性一次性', 'f', 'f', 'f', 3, '2025-08-12 11:35:34.835', '2025-08-13 07:29:39.857', 6, 'f', '[]', 0);
INSERT INTO "public"."Course" VALUES (28, '巴卡巴卡', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/03/c2a340d1-c691-4933-8208-436e4636bb82.png', '卡办卡不，办卡，学习办卡', '卡办卡不，办卡，学习办卡', '小王同学', 62, 0, 2, 'ELEMENTARY', 'ONGOING', 1, 670, NULL, '卡巴', 0, 0, 0, '学习卡巴', 'f', 'f', 'f', 1, '2025-08-03 08:14:16.74', '2025-08-13 07:57:25.139', 1, 't', '[{"url": "课程专为参与2024NewStar的学员精心打造。课程聚焦于该赛事的赛题，深入剖析每一道题目背后的逻辑、知识点及解题思路。通过详细讲解典型例题，帮助", "name": "范德萨"}]', 0);
INSERT INTO "public"."Course" VALUES (30, '课程22', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/12/393010f2-dfa4-4d0a-9877-b394eab5aa38.jpeg', '防守打法撒的发生', '防守打法撒的发生', '方法', 17, 0, 2, 'EXPERT', 'ONGOING', 0, 843, NULL, '地方士大夫士大夫士大夫', 100, 0, 0, '范德萨发撒的范德萨发撒的', 'f', 'f', 'f', 2, '2025-08-12 11:26:55.234', '2025-08-12 12:53:31.831', 6, 'f', '[{"url": " 范德萨范德萨方", "name": "范德萨"}, {"url": "范德萨发撒的范德萨方", "name": "范德萨发说法"}]', 0);
INSERT INTO "public"."Course" VALUES (32, '课程2', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/92d63f36-4e31-4531-a509-c4210fcbc190.jpeg', '课程2课程2课程2', '课程2课程2课程2', '课程223', 29, 0, 3, 'ELEMENTARY', 'ONGOING', 2, 843, NULL, '课程2课程2', 100, 0, 0, '课程2课程2', 'f', 'f', 'f', 1, '2025-08-13 07:24:26.965', '2025-08-13 07:45:18.198', 5, 'f', '[{"url": "第三方第三方斯蒂芬发撒的阿范德萨阿发", "name": "232"}]', 0);
INSERT INTO "public"."Course" VALUES (29, '课程1', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/11/70b4d0c1-c9e5-4068-9dd2-12f0ecd3d522.jpeg', '课程1课程1课程1课程1', '课程1课程1课程1课程1', '课程1', 134, 0, 1, 'ELEMENTARY', 'ONGOING', 0, 272, NULL, '课程1课程1课程1', 100, 0, 0, '课程1课程1课程1', 'f', 'f', 'f', 1, '2025-08-11 11:11:44.452', '2025-08-12 12:53:32.334', 6, 't', '[]', 555);

-- ----------------------------
-- Table structure for CourseCategory
-- ----------------------------
DROP TABLE IF EXISTS "public"."CourseCategory";
CREATE TABLE "public"."CourseCategory" (
  "id" int4 NOT NULL DEFAULT nextval('"CourseCategory_id_seq"'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of CourseCategory
-- ----------------------------
INSERT INTO "public"."CourseCategory" VALUES (1, '课程分类1', '2025-07-18 00:00:00', '2025-07-18 00:00:00');
INSERT INTO "public"."CourseCategory" VALUES (2, '课程分类2', '2025-07-20 05:26:48.819', '2025-07-20 05:26:48.819');
INSERT INTO "public"."CourseCategory" VALUES (3, 'LOl', '2025-07-20 05:38:44.422', '2025-07-20 05:38:44.422');
INSERT INTO "public"."CourseCategory" VALUES (4, '王者荣耀', '2025-07-20 05:38:53.053', '2025-07-20 05:38:53.053');
INSERT INTO "public"."CourseCategory" VALUES (5, '前端', '2025-07-20 05:39:00.076', '2025-07-20 05:39:00.076');
INSERT INTO "public"."CourseCategory" VALUES (6, 'JAVA', '2025-07-20 05:39:06.233', '2025-07-20 05:39:06.233');
INSERT INTO "public"."CourseCategory" VALUES (7, 'GO', '2025-07-20 05:39:11.333', '2025-07-20 05:39:11.333');
INSERT INTO "public"."CourseCategory" VALUES (8, 'PHP', '2025-07-20 05:39:19.677', '2025-07-20 05:39:19.677');
INSERT INTO "public"."CourseCategory" VALUES (9, 'PYTHON', '2025-07-20 05:39:55.456', '2025-07-20 05:39:55.456');
INSERT INTO "public"."CourseCategory" VALUES (10, 'C语言', '2025-07-20 05:40:02.005', '2025-07-20 05:40:02.005');
INSERT INTO "public"."CourseCategory" VALUES (11, 'C++', '2025-07-20 05:40:07.425', '2025-07-20 05:40:07.425');
INSERT INTO "public"."CourseCategory" VALUES (12, '微信小游戏', '2025-07-20 05:40:15.619', '2025-07-20 05:40:15.619');
INSERT INTO "public"."CourseCategory" VALUES (13, '微信小程序', '2025-07-20 05:40:23.355', '2025-07-20 05:40:23.355');
INSERT INTO "public"."CourseCategory" VALUES (14, 'unreal engine', '2025-07-20 05:40:34.132', '2025-07-20 05:40:34.132');
INSERT INTO "public"."CourseCategory" VALUES (15, 'unity pro', '2025-07-20 05:40:42.267', '2025-07-20 05:40:42.267');

-- ----------------------------
-- Table structure for CourseChapter
-- ----------------------------
DROP TABLE IF EXISTS "public"."CourseChapter";
CREATE TABLE "public"."CourseChapter" (
  "id" int4 NOT NULL DEFAULT nextval('"CourseChapter_id_seq"'::regclass),
  "parentId" int4,
  "title" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "videoUrl" varchar(500) COLLATE "pg_catalog"."default",
  "courseId" int4 NOT NULL,
  "duration" int4,
  "points" int4 NOT NULL DEFAULT 0,
  "viewCount" int4 NOT NULL DEFAULT 0,
  "sort" int4 NOT NULL DEFAULT 0,
  "uploaderId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "coverUrl" varchar(500) COLLATE "pg_catalog"."default",
  "totalPoints" int4 DEFAULT 0,
  "selectTotalPoints" bool NOT NULL DEFAULT false
)
;

-- ----------------------------
-- Records of CourseChapter
-- ----------------------------
INSERT INTO "public"."CourseChapter" VALUES (21, 19, '70岁老奶奶忠告', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/03/39680c9d-aefe-4021-9f6f-19d12ea3e62d.mp4', 28, 159, 0, 0, 33, 1, '2025-08-03 08:52:44.929', '2025-08-03 08:52:44.929', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/03/5325f4e7-46c1-44c8-836d-7f6965176f95.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (20, 19, '智械危机', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/03/4fcdb3a7-4b07-41c9-ab59-b92ce43aeaa4.mp4', 28, 159, 0, 0, 52, 1, '2025-08-03 08:41:03.906', '2025-08-03 08:52:55.921', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/03/8493e243-e64f-493f-920d-7a30415ccaec.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (22, NULL, '前端', NULL, NULL, 28, NULL, 0, 0, 2, 1, '2025-08-03 08:53:50.646', '2025-08-03 08:53:50.646', NULL, NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (19, NULL, 'WEB', NULL, NULL, 28, NULL, 0, 0, 3, 1, '2025-08-03 08:19:58.128', '2025-08-03 08:53:56.143', NULL, NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (23, 22, '输入框', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/03/b1b8154c-7864-4265-8155-9736b1a1124d.mp4', 28, 18, 0, 0, 0, 1, '2025-08-03 08:54:15.258', '2025-08-03 08:54:15.258', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/03/3f3db721-ac6d-4233-b3b7-1351f62cae6c.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (24, 22, '粒子特效', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/03/2ca4533a-6a3b-4d51-81fd-afcb72c99480.mp4', 28, 62, 0, 0, 0, 1, '2025-08-03 08:54:26.557', '2025-08-03 08:54:26.557', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/03/9310bfa9-5cf2-41da-ac05-b9f3967ccca0.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (25, 22, 'dataease', '发的', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/03/f37f6d59-bcdf-4010-98f0-e9d8d0712a2b.mp4', 28, 113, 0, 0, 0, 1, '2025-08-03 11:24:40.332', '2025-08-03 11:24:40.332', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/03/643b8e39-66e8-41f9-95c8-0f209cdfd2d2.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (26, NULL, '方', '是', NULL, 29, NULL, 0, 0, 0, 6, '2025-08-11 11:11:58.139', '2025-08-11 11:11:58.139', NULL, NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (27, 26, '222', '22', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/11/eac81651-36d1-4ceb-a1f0-bf30c0b06122.mp4', 29, 159, 0, 0, 0, 6, '2025-08-11 11:12:23.33', '2025-08-11 11:12:23.33', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/11/5b0f0c2b-fcc7-43e4-99a0-008863c609ab.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (28, 26, '课程123', '发电房', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/12/90a1e0c3-6552-461b-9f77-74a8998267a2.mp4', 29, 113, 0, 0, 0, 6, '2025-08-12 10:28:37.503', '2025-08-12 10:28:37.503', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/12/a96cfc00-b423-45e9-a4e0-c89b2783f4b7.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (29, NULL, '下杀手', NULL, NULL, 30, NULL, 0, 0, 0, 6, '2025-08-12 11:27:08.434', '2025-08-12 11:27:08.434', NULL, NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (30, 29, '更改', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/12/9e1bb228-9710-48cf-bad7-7b0e057eb190.mp4', 30, 159, 2, 0, 0, 6, '2025-08-12 11:31:28.735', '2025-08-12 11:31:28.735', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/12/01227820-de98-45f7-8936-600d29d4daf2.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (31, 29, '323', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/12/95f34d14-a872-4ae9-969b-90a9bf9ec897.mp4', 30, 684, 0, 0, 0, 6, '2025-08-12 11:31:59.241', '2025-08-12 11:31:59.241', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/12/fd413437-dfb2-485d-a62c-6571a8ab12d4.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (32, NULL, '大章节', NULL, NULL, 31, NULL, 0, 0, 0, 6, '2025-08-12 11:37:48.33', '2025-08-12 11:37:48.33', NULL, 555, 't');
INSERT INTO "public"."CourseChapter" VALUES (33, 32, '子章节', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/12/dd56aa08-f875-466e-8a09-32f43fb90747.mp4', 31, 18, 0, 0, 0, 6, '2025-08-12 11:38:19.474', '2025-08-12 11:38:19.474', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/12/fab8002c-4b4c-4aae-9826-3062d084d36c.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (35, 32, '3333', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/12/60d66267-ff57-472e-8d0e-cf67748cf368.mp4', 31, 159, 0, 0, 2, 6, '2025-08-12 13:18:58.349', '2025-08-12 13:18:58.349', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/12/e1abf1dc-563b-4b0e-aaea-3b2b0cc1c095.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (34, 32, '子阿甘敢接23', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/12/b0f9f9ce-7936-47ae-864b-ba612f04cf7e.mp4', 31, 159, 0, 0, 5, 6, '2025-08-12 11:38:47.635', '2025-08-12 13:19:15.294', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/12/e024335b-ced3-41dd-aa55-fcf185683d26.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (36, NULL, '大1章节', NULL, NULL, 31, NULL, 0, 0, 0, 6, '2025-08-12 13:27:29.375', '2025-08-12 13:27:29.375', NULL, 33, 't');
INSERT INTO "public"."CourseChapter" VALUES (37, 36, '32', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/12/a4833d41-5c74-4484-8dd5-a167c448497a.mp4', 31, 18, 0, 0, 2, 6, '2025-08-12 13:52:11.348', '2025-08-12 13:52:11.348', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/12/f8760866-6b67-48ef-8f35-4d3c69ec1d44.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (38, 36, '范德萨', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/12/f724abd2-c658-407e-81fb-536e791925a8.mp4', 31, 62, 0, 0, 0, 6, '2025-08-12 13:55:03.302', '2025-08-12 13:55:03.302', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/12/1974e089-cf9a-4ac5-8492-8ab4536061d1.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (39, 36, '2323', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/25166058-329f-411e-aec2-9c84ccb72fb4.mp4', 31, 575, 0, 0, 3, 6, '2025-08-12 16:13:53.263', '2025-08-12 16:13:53.263', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/d95c4507-fc83-4d27-8432-fc61fe7f4ea1.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (40, NULL, '56555', NULL, NULL, 31, NULL, 0, 0, 0, 6, '2025-08-13 01:14:02.213', '2025-08-13 01:14:02.213', NULL, 123, 't');
INSERT INTO "public"."CourseChapter" VALUES (41, 40, '555', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/757503a1-40c0-40a0-8002-eca259fdba2b.mp4', 31, 159, 0, 0, 2, 6, '2025-08-13 01:14:52.102', '2025-08-13 01:14:52.102', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/8f1b0b1d-027d-4076-83cc-4ea2ff9532b0.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (42, 40, '5552', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/e4357c2b-5e47-4c3a-9bd4-340def4a2568.mp4', 31, 575, 0, 0, 0, 6, '2025-08-13 01:15:51.212', '2025-08-13 01:15:51.212', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/28721029-ff26-42dd-b588-c55eade4a2ab.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (43, NULL, '主章节', NULL, NULL, 31, NULL, 0, 0, 0, 6, '2025-08-13 02:22:04.091', '2025-08-13 02:22:04.091', NULL, 666, 't');
INSERT INTO "public"."CourseChapter" VALUES (44, 43, '1', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/f4c493c8-e12d-40a2-93f5-a5cdff2ae9d8.mp4', 31, 159, 0, 0, 0, 6, '2025-08-13 02:22:27.058', '2025-08-13 02:22:27.058', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/68f7b3b7-881d-4ddc-9f7f-76bb333196a4.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (45, 43, '粒子特效', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/42a59ca1-fd94-44e3-9e96-e34482df05fe.mp4', 31, 62, 0, 0, 0, 6, '2025-08-13 02:22:42.496', '2025-08-13 02:22:42.496', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/d4b0553a-e77e-4686-a097-b062aba2c4c8.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (46, NULL, '自己的章节自己', NULL, NULL, 31, NULL, 0, 0, 0, 6, '2025-08-13 03:26:22.183', '2025-08-13 03:26:22.183', NULL, NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (47, 46, '70岁老奶奶忠告', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/40072f35-a853-465a-9b36-13a0bb53c0b6.mp4', 31, 159, 43, 0, 0, 6, '2025-08-13 03:27:30.628', '2025-08-13 03:27:30.628', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/9d7c2774-fb16-43a7-9a61-2f8e84225821.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (48, 46, 'github排行', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/ea9fae91-6ff0-460f-b7c3-531cfe68eea7.mp4', 31, 575, 2, 0, 0, 6, '2025-08-13 03:27:58.026', '2025-08-13 03:27:58.026', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/d97a9a82-01c9-4791-aa7a-395e4f4afcc8.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (49, 46, '3', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/e27fa584-15bf-4d0d-958c-658ef34c50b4.mp4', 31, 113, 0, 0, 0, 6, '2025-08-13 03:32:21.603', '2025-08-13 03:32:21.603', NULL, NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (50, 46, '55', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/d4676577-f579-497c-b43c-ecb532d01b10.mp4', 31, 684, 23, 0, 0, 6, '2025-08-13 03:45:04.294', '2025-08-13 03:45:04.294', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/a5a0aaa2-ad5a-40e6-aba3-0815f2ae1100.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (51, NULL, '新的', NULL, NULL, 32, NULL, 0, 0, 0, 5, '2025-08-13 07:24:39.412', '2025-08-13 07:24:39.412', NULL, NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (52, 51, '新的1', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/a0797bd1-d6b1-453e-bde3-cbfeb931d8d4.mp4', 32, 159, 2, 0, 0, 5, '2025-08-13 07:25:01.491', '2025-08-13 07:25:01.491', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/c93bcdc4-928c-4402-a636-f949f7c74e2a.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (53, 51, '新的2', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/da1e5470-379d-46bf-915f-6769ad77809e.mp4', 32, 684, 23, 0, 0, 5, '2025-08-13 07:36:15.073', '2025-08-13 07:36:15.073', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/37b17804-bc8a-43da-b8ce-130567e44b9d.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (54, 19, '70岁老奶奶忠告', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/efd85a05-595e-4b1a-9421-351cd0e4f844.mp4', 28, 159, 0, 0, 0, 1, '2025-08-13 07:57:21.546', '2025-08-13 07:57:21.546', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/3b7a83d7-4e61-4408-ac1d-3c2eab236feb.jpeg', NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (55, NULL, '23', NULL, NULL, 33, NULL, 0, 0, 0, 1, '2025-08-13 07:58:41.523', '2025-08-13 07:58:41.523', NULL, NULL, 'f');
INSERT INTO "public"."CourseChapter" VALUES (56, 55, '23232', NULL, 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/13/495b3f61-a58a-441a-9b50-76058eeeb524.mp4', 33, 189, 23, 0, 0, 1, '2025-08-13 08:00:01.166', '2025-08-13 08:00:01.166', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/13/a8b174ad-cf2c-4a9a-a2b7-6f326c6a1d68.jpeg', NULL, 'f');

-- ----------------------------
-- Table structure for CourseChapterLog
-- ----------------------------
DROP TABLE IF EXISTS "public"."CourseChapterLog";
CREATE TABLE "public"."CourseChapterLog" (
  "id" int4 NOT NULL DEFAULT nextval('"CourseChapterLog_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "courseId" int4 NOT NULL,
  "chapterId" int4 NOT NULL,
  "progress" int4 NOT NULL DEFAULT 0,
  "timestamp" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of CourseChapterLog
-- ----------------------------
INSERT INTO "public"."CourseChapterLog" VALUES (462, 6, 31, 39, 51, '2025-08-12 17:19:46.726');
INSERT INTO "public"."CourseChapterLog" VALUES (463, 6, 31, 39, 51, '2025-08-12 17:19:46.752');
INSERT INTO "public"."CourseChapterLog" VALUES (464, 6, 31, 39, 51, '2025-08-12 17:19:46.752');
INSERT INTO "public"."CourseChapterLog" VALUES (465, 6, 31, 39, 0, '2025-08-12 17:19:46.854');
INSERT INTO "public"."CourseChapterLog" VALUES (466, 6, 31, 39, 51, '2025-08-12 17:19:47.655');
INSERT INTO "public"."CourseChapterLog" VALUES (467, 6, 31, 39, 52, '2025-08-12 17:19:49.451');
INSERT INTO "public"."CourseChapterLog" VALUES (468, 6, 31, 39, 53, '2025-08-12 17:19:55.3');
INSERT INTO "public"."CourseChapterLog" VALUES (469, 6, 31, 39, 54, '2025-08-12 17:20:00.888');
INSERT INTO "public"."CourseChapterLog" VALUES (470, 6, 31, 39, 55, '2025-08-12 17:20:06.758');
INSERT INTO "public"."CourseChapterLog" VALUES (471, 6, 31, 39, 56, '2025-08-12 17:20:12.578');
INSERT INTO "public"."CourseChapterLog" VALUES (472, 6, 31, 39, 0, '2025-08-12 17:20:15.517');
INSERT INTO "public"."CourseChapterLog" VALUES (473, 6, 31, 39, 56, '2025-08-12 17:20:15.794');
INSERT INTO "public"."CourseChapterLog" VALUES (474, 6, 31, 33, 0, '2025-08-12 17:22:45.867');
INSERT INTO "public"."CourseChapterLog" VALUES (475, 6, 31, 33, 11, '2025-08-12 17:22:47.964');
INSERT INTO "public"."CourseChapterLog" VALUES (476, 6, 31, 33, 12, '2025-08-12 17:22:48.271');
INSERT INTO "public"."CourseChapterLog" VALUES (477, 6, 31, 33, 14, '2025-08-12 17:22:48.498');
INSERT INTO "public"."CourseChapterLog" VALUES (478, 6, 31, 33, 15, '2025-08-12 17:22:48.776');
INSERT INTO "public"."CourseChapterLog" VALUES (479, 6, 31, 33, 17, '2025-08-12 17:22:49.04');
INSERT INTO "public"."CourseChapterLog" VALUES (480, 6, 31, 33, 18, '2025-08-12 17:22:49.319');
INSERT INTO "public"."CourseChapterLog" VALUES (481, 6, 31, 33, 20, '2025-08-12 17:22:49.566');
INSERT INTO "public"."CourseChapterLog" VALUES (482, 6, 31, 33, 21, '2025-08-12 17:22:49.824');
INSERT INTO "public"."CourseChapterLog" VALUES (483, 6, 31, 33, 22, '2025-08-12 17:22:50.097');
INSERT INTO "public"."CourseChapterLog" VALUES (484, 6, 31, 33, 24, '2025-08-12 17:22:50.363');
INSERT INTO "public"."CourseChapterLog" VALUES (485, 6, 31, 33, 25, '2025-08-12 17:22:50.61');
INSERT INTO "public"."CourseChapterLog" VALUES (486, 6, 31, 33, 27, '2025-08-12 17:22:50.891');
INSERT INTO "public"."CourseChapterLog" VALUES (487, 6, 31, 33, 28, '2025-08-12 17:22:51.163');
INSERT INTO "public"."CourseChapterLog" VALUES (488, 6, 31, 33, 30, '2025-08-12 17:22:51.432');
INSERT INTO "public"."CourseChapterLog" VALUES (489, 6, 31, 33, 31, '2025-08-12 17:22:51.673');
INSERT INTO "public"."CourseChapterLog" VALUES (490, 6, 31, 33, 33, '2025-08-12 17:22:51.966');
INSERT INTO "public"."CourseChapterLog" VALUES (491, 6, 31, 33, 34, '2025-08-12 17:22:52.216');
INSERT INTO "public"."CourseChapterLog" VALUES (492, 6, 31, 33, 36, '2025-08-12 17:22:52.485');
INSERT INTO "public"."CourseChapterLog" VALUES (493, 6, 31, 33, 37, '2025-08-12 17:22:52.732');
INSERT INTO "public"."CourseChapterLog" VALUES (494, 6, 31, 33, 38, '2025-08-12 17:22:53.026');
INSERT INTO "public"."CourseChapterLog" VALUES (495, 6, 31, 33, 40, '2025-08-12 17:22:53.28');
INSERT INTO "public"."CourseChapterLog" VALUES (496, 6, 31, 33, 41, '2025-08-12 17:22:53.531');
INSERT INTO "public"."CourseChapterLog" VALUES (497, 6, 31, 33, 43, '2025-08-12 17:22:53.804');
INSERT INTO "public"."CourseChapterLog" VALUES (498, 6, 31, 33, 44, '2025-08-12 17:22:54.078');
INSERT INTO "public"."CourseChapterLog" VALUES (499, 6, 31, 33, 46, '2025-08-12 17:22:54.354');
INSERT INTO "public"."CourseChapterLog" VALUES (500, 6, 31, 33, 47, '2025-08-12 17:22:54.604');
INSERT INTO "public"."CourseChapterLog" VALUES (501, 6, 31, 33, 49, '2025-08-12 17:22:54.89');
INSERT INTO "public"."CourseChapterLog" VALUES (502, 6, 31, 33, 50, '2025-08-12 17:22:55.133');
INSERT INTO "public"."CourseChapterLog" VALUES (503, 6, 31, 33, 51, '2025-08-12 17:22:55.411');
INSERT INTO "public"."CourseChapterLog" VALUES (504, 6, 31, 33, 53, '2025-08-12 17:22:55.679');
INSERT INTO "public"."CourseChapterLog" VALUES (505, 6, 31, 33, 54, '2025-08-12 17:22:55.931');
INSERT INTO "public"."CourseChapterLog" VALUES (506, 6, 31, 33, 56, '2025-08-12 17:22:56.213');
INSERT INTO "public"."CourseChapterLog" VALUES (507, 6, 31, 33, 57, '2025-08-12 17:22:56.471');
INSERT INTO "public"."CourseChapterLog" VALUES (508, 6, 31, 33, 59, '2025-08-12 17:22:56.724');
INSERT INTO "public"."CourseChapterLog" VALUES (509, 6, 31, 33, 60, '2025-08-12 17:22:57.013');
INSERT INTO "public"."CourseChapterLog" VALUES (510, 6, 31, 33, 62, '2025-08-12 17:22:57.262');
INSERT INTO "public"."CourseChapterLog" VALUES (511, 6, 31, 33, 63, '2025-08-12 17:22:57.548');
INSERT INTO "public"."CourseChapterLog" VALUES (512, 6, 31, 33, 65, '2025-08-12 17:22:57.781');
INSERT INTO "public"."CourseChapterLog" VALUES (513, 6, 31, 33, 0, '2025-08-12 17:22:59.417');
INSERT INTO "public"."CourseChapterLog" VALUES (514, 6, 31, 33, 67, '2025-08-12 17:22:59.698');
INSERT INTO "public"."CourseChapterLog" VALUES (515, 6, 31, 33, 68, '2025-08-12 17:22:59.941');
INSERT INTO "public"."CourseChapterLog" VALUES (516, 6, 31, 33, 69, '2025-08-12 17:23:00.2');
INSERT INTO "public"."CourseChapterLog" VALUES (517, 6, 31, 33, 71, '2025-08-12 17:23:00.476');
INSERT INTO "public"."CourseChapterLog" VALUES (518, 6, 31, 33, 72, '2025-08-12 17:23:00.73');
INSERT INTO "public"."CourseChapterLog" VALUES (519, 6, 31, 33, 74, '2025-08-12 17:23:01.002');
INSERT INTO "public"."CourseChapterLog" VALUES (520, 6, 31, 33, 75, '2025-08-12 17:23:01.296');
INSERT INTO "public"."CourseChapterLog" VALUES (521, 6, 31, 33, 77, '2025-08-12 17:23:01.546');
INSERT INTO "public"."CourseChapterLog" VALUES (522, 6, 31, 33, 78, '2025-08-12 17:23:01.794');
INSERT INTO "public"."CourseChapterLog" VALUES (523, 6, 31, 33, 80, '2025-08-12 17:23:02.066');
INSERT INTO "public"."CourseChapterLog" VALUES (524, 6, 31, 33, 81, '2025-08-12 17:23:02.332');
INSERT INTO "public"."CourseChapterLog" VALUES (525, 6, 31, 33, 83, '2025-08-12 17:23:02.599');
INSERT INTO "public"."CourseChapterLog" VALUES (526, 6, 31, 33, 84, '2025-08-12 17:23:02.861');
INSERT INTO "public"."CourseChapterLog" VALUES (527, 6, 31, 33, 85, '2025-08-12 17:23:03.132');
INSERT INTO "public"."CourseChapterLog" VALUES (528, 6, 31, 33, 87, '2025-08-12 17:23:03.386');
INSERT INTO "public"."CourseChapterLog" VALUES (529, 6, 31, 33, 88, '2025-08-12 17:23:03.662');
INSERT INTO "public"."CourseChapterLog" VALUES (530, 6, 31, 33, 90, '2025-08-12 17:23:03.918');
INSERT INTO "public"."CourseChapterLog" VALUES (531, 6, 31, 33, 91, '2025-08-12 17:23:04.194');
INSERT INTO "public"."CourseChapterLog" VALUES (532, 6, 31, 33, 93, '2025-08-12 17:23:04.45');
INSERT INTO "public"."CourseChapterLog" VALUES (533, 6, 31, 33, 94, '2025-08-12 17:23:04.73');
INSERT INTO "public"."CourseChapterLog" VALUES (534, 6, 31, 33, 96, '2025-08-12 17:23:04.983');
INSERT INTO "public"."CourseChapterLog" VALUES (535, 6, 31, 33, 97, '2025-08-12 17:23:05.267');
INSERT INTO "public"."CourseChapterLog" VALUES (536, 6, 31, 33, 99, '2025-08-12 17:23:05.518');
INSERT INTO "public"."CourseChapterLog" VALUES (537, 6, 31, 33, 0, '2025-08-12 17:23:06.35');
INSERT INTO "public"."CourseChapterLog" VALUES (538, 6, 31, 33, 11, '2025-08-12 17:23:08.466');
INSERT INTO "public"."CourseChapterLog" VALUES (539, 6, 31, 33, 12, '2025-08-12 17:23:08.728');
INSERT INTO "public"."CourseChapterLog" VALUES (540, 6, 31, 33, 13, '2025-08-12 17:23:08.795');
INSERT INTO "public"."CourseChapterLog" VALUES (541, 6, 31, 33, 0, '2025-08-12 17:26:29.962');
INSERT INTO "public"."CourseChapterLog" VALUES (542, 6, 31, 33, 14, '2025-08-12 17:26:30.185');
INSERT INTO "public"."CourseChapterLog" VALUES (543, 6, 31, 33, 15, '2025-08-12 17:26:30.469');
INSERT INTO "public"."CourseChapterLog" VALUES (544, 6, 31, 33, 17, '2025-08-12 17:26:30.711');
INSERT INTO "public"."CourseChapterLog" VALUES (545, 6, 31, 33, 18, '2025-08-12 17:26:30.982');
INSERT INTO "public"."CourseChapterLog" VALUES (546, 6, 31, 33, 0, '2025-08-12 17:28:54.745');
INSERT INTO "public"."CourseChapterLog" VALUES (547, 6, 31, 33, 19, '2025-08-12 17:28:55.003');
INSERT INTO "public"."CourseChapterLog" VALUES (548, 6, 31, 33, 20, '2025-08-12 17:28:56.1');
INSERT INTO "public"."CourseChapterLog" VALUES (549, 6, 31, 33, 22, '2025-08-12 17:28:56.101');
INSERT INTO "public"."CourseChapterLog" VALUES (550, 6, 31, 33, 25, '2025-08-12 17:28:56.146');
INSERT INTO "public"."CourseChapterLog" VALUES (551, 6, 31, 33, 23, '2025-08-12 17:28:56.173');
INSERT INTO "public"."CourseChapterLog" VALUES (552, 6, 31, 33, 26, '2025-08-12 17:28:56.361');
INSERT INTO "public"."CourseChapterLog" VALUES (553, 6, 31, 33, 28, '2025-08-12 17:28:56.606');
INSERT INTO "public"."CourseChapterLog" VALUES (554, 6, 31, 33, 29, '2025-08-12 17:28:56.851');
INSERT INTO "public"."CourseChapterLog" VALUES (555, 6, 31, 33, 31, '2025-08-12 17:28:57.118');
INSERT INTO "public"."CourseChapterLog" VALUES (556, 6, 31, 33, 32, '2025-08-12 17:28:57.411');
INSERT INTO "public"."CourseChapterLog" VALUES (557, 6, 31, 33, 34, '2025-08-12 17:28:57.646');
INSERT INTO "public"."CourseChapterLog" VALUES (558, 6, 31, 33, 35, '2025-08-12 17:28:57.92');
INSERT INTO "public"."CourseChapterLog" VALUES (559, 6, 31, 33, 36, '2025-08-12 17:28:58.188');
INSERT INTO "public"."CourseChapterLog" VALUES (560, 6, 31, 33, 38, '2025-08-12 17:28:58.448');
INSERT INTO "public"."CourseChapterLog" VALUES (561, 6, 31, 33, 39, '2025-08-12 17:28:58.724');
INSERT INTO "public"."CourseChapterLog" VALUES (562, 6, 31, 33, 41, '2025-08-12 17:28:58.972');
INSERT INTO "public"."CourseChapterLog" VALUES (563, 6, 31, 33, 42, '2025-08-12 17:28:59.257');
INSERT INTO "public"."CourseChapterLog" VALUES (564, 6, 31, 33, 0, '2025-08-12 17:29:02.614');
INSERT INTO "public"."CourseChapterLog" VALUES (565, 6, 31, 33, 43, '2025-08-12 17:29:02.876');
INSERT INTO "public"."CourseChapterLog" VALUES (566, 6, 31, 33, 45, '2025-08-12 17:29:03.118');
INSERT INTO "public"."CourseChapterLog" VALUES (567, 6, 31, 35, 0, '2025-08-12 17:29:09.923');
INSERT INTO "public"."CourseChapterLog" VALUES (568, 6, 31, 35, 10, '2025-08-12 17:29:26.157');
INSERT INTO "public"."CourseChapterLog" VALUES (569, 6, 31, 35, 11, '2025-08-12 17:29:27.749');
INSERT INTO "public"."CourseChapterLog" VALUES (570, 6, 31, 35, 12, '2025-08-12 17:29:29.078');
INSERT INTO "public"."CourseChapterLog" VALUES (571, 6, 31, 35, 13, '2025-08-12 17:29:30.679');
INSERT INTO "public"."CourseChapterLog" VALUES (572, 6, 31, 35, 14, '2025-08-12 17:29:32.53');
INSERT INTO "public"."CourseChapterLog" VALUES (573, 6, 31, 35, 15, '2025-08-12 17:29:33.859');
INSERT INTO "public"."CourseChapterLog" VALUES (574, 6, 31, 35, 16, '2025-08-12 17:29:35.469');
INSERT INTO "public"."CourseChapterLog" VALUES (575, 6, 31, 35, 17, '2025-08-12 17:29:37.307');
INSERT INTO "public"."CourseChapterLog" VALUES (576, 6, 31, 35, 18, '2025-08-12 17:29:47.847');
INSERT INTO "public"."CourseChapterLog" VALUES (577, 6, 31, 35, 18, '2025-08-12 17:29:47.867');
INSERT INTO "public"."CourseChapterLog" VALUES (578, 6, 31, 35, 18, '2025-08-12 17:29:47.873');
INSERT INTO "public"."CourseChapterLog" VALUES (579, 6, 31, 35, 18, '2025-08-12 17:29:47.874');
INSERT INTO "public"."CourseChapterLog" VALUES (580, 6, 31, 35, 19, '2025-08-12 17:29:48.963');
INSERT INTO "public"."CourseChapterLog" VALUES (581, 6, 31, 35, 19, '2025-08-12 17:29:48.972');
INSERT INTO "public"."CourseChapterLog" VALUES (582, 6, 31, 33, 43, '2025-08-12 17:29:51.685');
INSERT INTO "public"."CourseChapterLog" VALUES (583, 6, 31, 33, 0, '2025-08-12 17:30:30.263');
INSERT INTO "public"."CourseChapterLog" VALUES (584, 6, 31, 33, 45, '2025-08-12 17:30:30.566');
INSERT INTO "public"."CourseChapterLog" VALUES (585, 6, 31, 33, 46, '2025-08-12 17:30:30.747');
INSERT INTO "public"."CourseChapterLog" VALUES (586, 6, 31, 35, 16, '2025-08-13 02:40:32.707');
INSERT INTO "public"."CourseChapterLog" VALUES (587, 6, 31, 45, 0, '2025-08-13 03:13:42.428');
INSERT INTO "public"."CourseChapterLog" VALUES (588, 6, 31, 45, 10, '2025-08-13 03:13:47.561');
INSERT INTO "public"."CourseChapterLog" VALUES (589, 6, 31, 45, 11, '2025-08-13 03:13:48.35');
INSERT INTO "public"."CourseChapterLog" VALUES (590, 6, 31, 45, 12, '2025-08-13 03:13:48.888');
INSERT INTO "public"."CourseChapterLog" VALUES (591, 6, 31, 45, 13, '2025-08-13 03:13:49.606');
INSERT INTO "public"."CourseChapterLog" VALUES (592, 6, 31, 45, 14, '2025-08-13 03:13:50.2');
INSERT INTO "public"."CourseChapterLog" VALUES (593, 6, 31, 45, 15, '2025-08-13 03:13:50.74');
INSERT INTO "public"."CourseChapterLog" VALUES (594, 6, 31, 45, 16, '2025-08-13 03:13:51.278');
INSERT INTO "public"."CourseChapterLog" VALUES (595, 6, 31, 45, 17, '2025-08-13 03:13:52.057');
INSERT INTO "public"."CourseChapterLog" VALUES (596, 6, 31, 45, 18, '2025-08-13 03:13:52.583');
INSERT INTO "public"."CourseChapterLog" VALUES (597, 6, 31, 45, 19, '2025-08-13 03:13:53.128');
INSERT INTO "public"."CourseChapterLog" VALUES (598, 6, 31, 45, 20, '2025-08-13 03:13:53.931');
INSERT INTO "public"."CourseChapterLog" VALUES (600, 6, 31, 45, 22, '2025-08-13 03:13:54.985');
INSERT INTO "public"."CourseChapterLog" VALUES (650, 6, 31, 45, 72, '2025-08-13 03:14:26.099');
INSERT INTO "public"."CourseChapterLog" VALUES (654, 6, 31, 45, 76, '2025-08-13 03:14:28.489');
INSERT INTO "public"."CourseChapterLog" VALUES (659, 6, 31, 45, 81, '2025-08-13 03:14:31.677');
INSERT INTO "public"."CourseChapterLog" VALUES (599, 6, 31, 45, 21, '2025-08-13 03:13:54.452');
INSERT INTO "public"."CourseChapterLog" VALUES (602, 6, 31, 45, 24, '2025-08-13 03:13:56.302');
INSERT INTO "public"."CourseChapterLog" VALUES (605, 6, 31, 45, 27, '2025-08-13 03:13:58.169');
INSERT INTO "public"."CourseChapterLog" VALUES (608, 6, 31, 45, 30, '2025-08-13 03:14:00.035');
INSERT INTO "public"."CourseChapterLog" VALUES (610, 6, 31, 45, 32, '2025-08-13 03:14:01.366');
INSERT INTO "public"."CourseChapterLog" VALUES (612, 6, 31, 45, 34, '2025-08-13 03:14:02.417');
INSERT INTO "public"."CourseChapterLog" VALUES (613, 6, 31, 45, 35, '2025-08-13 03:14:03.219');
INSERT INTO "public"."CourseChapterLog" VALUES (614, 6, 31, 45, 36, '2025-08-13 03:14:03.75');
INSERT INTO "public"."CourseChapterLog" VALUES (615, 6, 31, 45, 37, '2025-08-13 03:14:04.284');
INSERT INTO "public"."CourseChapterLog" VALUES (619, 6, 31, 45, 41, '2025-08-13 03:14:06.937');
INSERT INTO "public"."CourseChapterLog" VALUES (623, 6, 31, 45, 45, '2025-08-13 03:14:09.317');
INSERT INTO "public"."CourseChapterLog" VALUES (627, 6, 31, 45, 49, '2025-08-13 03:14:11.759');
INSERT INTO "public"."CourseChapterLog" VALUES (628, 6, 31, 45, 50, '2025-08-13 03:14:12.528');
INSERT INTO "public"."CourseChapterLog" VALUES (634, 6, 31, 45, 56, '2025-08-13 03:14:16.248');
INSERT INTO "public"."CourseChapterLog" VALUES (637, 6, 31, 45, 59, '2025-08-13 03:14:18.096');
INSERT INTO "public"."CourseChapterLog" VALUES (638, 6, 31, 45, 60, '2025-08-13 03:14:18.637');
INSERT INTO "public"."CourseChapterLog" VALUES (644, 6, 31, 45, 66, '2025-08-13 03:14:22.377');
INSERT INTO "public"."CourseChapterLog" VALUES (649, 6, 31, 45, 71, '2025-08-13 03:14:25.574');
INSERT INTO "public"."CourseChapterLog" VALUES (651, 6, 31, 45, 73, '2025-08-13 03:14:26.632');
INSERT INTO "public"."CourseChapterLog" VALUES (652, 6, 31, 45, 74, '2025-08-13 03:14:27.427');
INSERT INTO "public"."CourseChapterLog" VALUES (656, 6, 31, 45, 78, '2025-08-13 03:14:29.815');
INSERT INTO "public"."CourseChapterLog" VALUES (657, 6, 31, 45, 79, '2025-08-13 03:14:30.347');
INSERT INTO "public"."CourseChapterLog" VALUES (663, 6, 31, 45, 85, '2025-08-13 03:14:34.077');
INSERT INTO "public"."CourseChapterLog" VALUES (664, 6, 31, 45, 86, '2025-08-13 03:14:34.877');
INSERT INTO "public"."CourseChapterLog" VALUES (665, 6, 31, 45, 87, '2025-08-13 03:14:35.409');
INSERT INTO "public"."CourseChapterLog" VALUES (601, 6, 31, 45, 23, '2025-08-13 03:13:55.78');
INSERT INTO "public"."CourseChapterLog" VALUES (603, 6, 31, 45, 25, '2025-08-13 03:13:56.839');
INSERT INTO "public"."CourseChapterLog" VALUES (611, 6, 31, 45, 33, '2025-08-13 03:14:01.885');
INSERT INTO "public"."CourseChapterLog" VALUES (618, 6, 31, 45, 40, '2025-08-13 03:14:06.146');
INSERT INTO "public"."CourseChapterLog" VALUES (626, 6, 31, 45, 48, '2025-08-13 03:14:11.189');
INSERT INTO "public"."CourseChapterLog" VALUES (630, 6, 31, 45, 52, '2025-08-13 03:14:13.607');
INSERT INTO "public"."CourseChapterLog" VALUES (631, 6, 31, 45, 53, '2025-08-13 03:14:14.398');
INSERT INTO "public"."CourseChapterLog" VALUES (632, 6, 31, 45, 54, '2025-08-13 03:14:14.932');
INSERT INTO "public"."CourseChapterLog" VALUES (633, 6, 31, 45, 55, '2025-08-13 03:14:15.456');
INSERT INTO "public"."CourseChapterLog" VALUES (636, 6, 31, 45, 58, '2025-08-13 03:14:17.306');
INSERT INTO "public"."CourseChapterLog" VALUES (640, 6, 31, 45, 62, '2025-08-13 03:14:19.983');
INSERT INTO "public"."CourseChapterLog" VALUES (641, 6, 31, 45, 63, '2025-08-13 03:14:20.535');
INSERT INTO "public"."CourseChapterLog" VALUES (645, 6, 31, 45, 67, '2025-08-13 03:14:22.906');
INSERT INTO "public"."CourseChapterLog" VALUES (647, 6, 31, 45, 69, '2025-08-13 03:14:24.231');
INSERT INTO "public"."CourseChapterLog" VALUES (648, 6, 31, 45, 70, '2025-08-13 03:14:24.762');
INSERT INTO "public"."CourseChapterLog" VALUES (653, 6, 31, 45, 75, '2025-08-13 03:14:27.962');
INSERT INTO "public"."CourseChapterLog" VALUES (655, 6, 31, 45, 77, '2025-08-13 03:14:29.281');
INSERT INTO "public"."CourseChapterLog" VALUES (658, 6, 31, 45, 80, '2025-08-13 03:14:31.149');
INSERT INTO "public"."CourseChapterLog" VALUES (660, 6, 31, 45, 82, '2025-08-13 03:14:32.217');
INSERT INTO "public"."CourseChapterLog" VALUES (662, 6, 31, 45, 84, '2025-08-13 03:14:33.556');
INSERT INTO "public"."CourseChapterLog" VALUES (604, 6, 31, 45, 26, '2025-08-13 03:13:57.638');
INSERT INTO "public"."CourseChapterLog" VALUES (607, 6, 31, 45, 29, '2025-08-13 03:13:59.508');
INSERT INTO "public"."CourseChapterLog" VALUES (617, 6, 31, 45, 39, '2025-08-13 03:14:05.607');
INSERT INTO "public"."CourseChapterLog" VALUES (621, 6, 31, 45, 43, '2025-08-13 03:14:08.005');
INSERT INTO "public"."CourseChapterLog" VALUES (624, 6, 31, 45, 46, '2025-08-13 03:14:09.861');
INSERT INTO "public"."CourseChapterLog" VALUES (625, 6, 31, 45, 47, '2025-08-13 03:14:10.652');
INSERT INTO "public"."CourseChapterLog" VALUES (635, 6, 31, 45, 57, '2025-08-13 03:14:16.801');
INSERT INTO "public"."CourseChapterLog" VALUES (643, 6, 31, 45, 65, '2025-08-13 03:14:21.868');
INSERT INTO "public"."CourseChapterLog" VALUES (646, 6, 31, 45, 68, '2025-08-13 03:14:23.702');
INSERT INTO "public"."CourseChapterLog" VALUES (661, 6, 31, 45, 83, '2025-08-13 03:14:33.011');
INSERT INTO "public"."CourseChapterLog" VALUES (666, 6, 31, 45, 88, '2025-08-13 03:14:35.938');
INSERT INTO "public"."CourseChapterLog" VALUES (606, 6, 31, 45, 28, '2025-08-13 03:13:58.71');
INSERT INTO "public"."CourseChapterLog" VALUES (609, 6, 31, 45, 31, '2025-08-13 03:14:00.578');
INSERT INTO "public"."CourseChapterLog" VALUES (616, 6, 31, 45, 38, '2025-08-13 03:14:05.075');
INSERT INTO "public"."CourseChapterLog" VALUES (620, 6, 31, 45, 42, '2025-08-13 03:14:07.478');
INSERT INTO "public"."CourseChapterLog" VALUES (622, 6, 31, 45, 44, '2025-08-13 03:14:08.807');
INSERT INTO "public"."CourseChapterLog" VALUES (629, 6, 31, 45, 51, '2025-08-13 03:14:13.074');
INSERT INTO "public"."CourseChapterLog" VALUES (639, 6, 31, 45, 61, '2025-08-13 03:14:19.182');
INSERT INTO "public"."CourseChapterLog" VALUES (642, 6, 31, 45, 64, '2025-08-13 03:14:21.053');
INSERT INTO "public"."CourseChapterLog" VALUES (667, 6, 31, 45, 89, '2025-08-13 03:14:36.732');
INSERT INTO "public"."CourseChapterLog" VALUES (668, 6, 31, 45, 90, '2025-08-13 03:14:37.271');
INSERT INTO "public"."CourseChapterLog" VALUES (669, 6, 31, 45, 91, '2025-08-13 03:14:37.805');
INSERT INTO "public"."CourseChapterLog" VALUES (670, 6, 31, 45, 92, '2025-08-13 03:14:38.604');
INSERT INTO "public"."CourseChapterLog" VALUES (671, 6, 31, 45, 93, '2025-08-13 03:14:39.135');
INSERT INTO "public"."CourseChapterLog" VALUES (672, 6, 31, 45, 94, '2025-08-13 03:14:39.659');
INSERT INTO "public"."CourseChapterLog" VALUES (673, 6, 31, 45, 95, '2025-08-13 03:14:40.468');
INSERT INTO "public"."CourseChapterLog" VALUES (674, 6, 31, 45, 96, '2025-08-13 03:14:40.992');
INSERT INTO "public"."CourseChapterLog" VALUES (675, 6, 31, 45, 97, '2025-08-13 03:14:41.519');
INSERT INTO "public"."CourseChapterLog" VALUES (676, 6, 31, 45, 98, '2025-08-13 03:14:42.313');
INSERT INTO "public"."CourseChapterLog" VALUES (677, 6, 31, 45, 99, '2025-08-13 03:14:42.842');
INSERT INTO "public"."CourseChapterLog" VALUES (678, 6, 31, 47, 0, '2025-08-13 05:45:07.913');
INSERT INTO "public"."CourseChapterLog" VALUES (679, 5, 31, 44, 0, '2025-08-13 06:14:20.618');
INSERT INTO "public"."CourseChapterLog" VALUES (680, 5, 31, 45, 0, '2025-08-13 06:14:56.95');
INSERT INTO "public"."CourseChapterLog" VALUES (681, 5, 31, 33, 0, '2025-08-13 06:15:07.742');
INSERT INTO "public"."CourseChapterLog" VALUES (682, 5, 32, 52, 0, '2025-08-13 07:29:49.691');

-- ----------------------------
-- Table structure for CourseComment
-- ----------------------------
DROP TABLE IF EXISTS "public"."CourseComment";
CREATE TABLE "public"."CourseComment" (
  "id" int4 NOT NULL DEFAULT nextval('"CourseComment_id_seq"'::regclass),
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" int4 NOT NULL,
  "courseId" int4 NOT NULL,
  "chapterId" int4,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "parentId" int4,
  "pics" text[] COLLATE "pg_catalog"."default" DEFAULT ARRAY[]::text[]
)
;

-- ----------------------------
-- Records of CourseComment
-- ----------------------------
INSERT INTO "public"."CourseComment" VALUES (36, 'gg
', 1, 28, NULL, '2025-08-03 16:29:55.888', NULL, '{}');

-- ----------------------------
-- Table structure for CourseCommentLike
-- ----------------------------
DROP TABLE IF EXISTS "public"."CourseCommentLike";
CREATE TABLE "public"."CourseCommentLike" (
  "id" int4 NOT NULL DEFAULT nextval('"CourseCommentLike_id_seq"'::regclass),
  "commentId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of CourseCommentLike
-- ----------------------------
INSERT INTO "public"."CourseCommentLike" VALUES (3, 36, 1, '2025-08-03 16:29:59.664');

-- ----------------------------
-- Table structure for CourseDirection
-- ----------------------------
DROP TABLE IF EXISTS "public"."CourseDirection";
CREATE TABLE "public"."CourseDirection" (
  "id" int4 NOT NULL DEFAULT nextval('"CourseDirection_id_seq"'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of CourseDirection
-- ----------------------------
INSERT INTO "public"."CourseDirection" VALUES (1, 'UI', '2025-07-20 05:40:56.304', '2025-07-20 05:40:56.304');
INSERT INTO "public"."CourseDirection" VALUES (2, '产品', '2025-07-20 05:41:03.256', '2025-07-20 05:41:03.256');
INSERT INTO "public"."CourseDirection" VALUES (3, '架构师', '2025-07-20 05:41:11.043', '2025-07-20 05:41:11.043');
INSERT INTO "public"."CourseDirection" VALUES (4, '移动端', '2025-07-20 05:41:23.458', '2025-07-20 05:41:23.458');
INSERT INTO "public"."CourseDirection" VALUES (5, '运营', '2025-07-20 05:41:30.624', '2025-07-20 05:41:30.624');
INSERT INTO "public"."CourseDirection" VALUES (6, '推广', '2025-07-20 05:41:37.361', '2025-07-20 05:41:37.361');
INSERT INTO "public"."CourseDirection" VALUES (7, '策划', '2025-07-20 05:41:44.18', '2025-07-20 05:41:44.18');
INSERT INTO "public"."CourseDirection" VALUES (8, '音效师', '2025-07-20 05:41:51.1', '2025-07-20 05:41:51.1');
INSERT INTO "public"."CourseDirection" VALUES (9, '美术', '2025-07-20 05:41:57.05', '2025-07-20 05:41:57.05');
INSERT INTO "public"."CourseDirection" VALUES (10, '配音演员', '2025-07-20 05:42:06.591', '2025-07-20 05:42:06.591');
INSERT INTO "public"."CourseDirection" VALUES (11, '3D建模', '2025-07-20 05:42:16.247', '2025-07-20 05:42:16.247');

-- ----------------------------
-- Table structure for CourseFavorite
-- ----------------------------
DROP TABLE IF EXISTS "public"."CourseFavorite";
CREATE TABLE "public"."CourseFavorite" (
  "id" int4 NOT NULL DEFAULT nextval('"CourseFavorite_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "courseId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of CourseFavorite
-- ----------------------------
INSERT INTO "public"."CourseFavorite" VALUES (3, 2, 28, '2025-08-03 10:33:42.677');

-- ----------------------------
-- Table structure for CourseLike
-- ----------------------------
DROP TABLE IF EXISTS "public"."CourseLike";
CREATE TABLE "public"."CourseLike" (
  "id" int4 NOT NULL DEFAULT nextval('"CourseLike_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "courseId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of CourseLike
-- ----------------------------
INSERT INTO "public"."CourseLike" VALUES (3, 2, 28, '2025-08-03 10:33:38.658');
INSERT INTO "public"."CourseLike" VALUES (6, 1, 28, '2025-08-03 16:30:53.794');
INSERT INTO "public"."CourseLike" VALUES (7, 6, 31, '2025-08-13 05:54:11.89');
INSERT INTO "public"."CourseLike" VALUES (8, 5, 31, '2025-08-13 06:12:23.526');

-- ----------------------------
-- Table structure for CourseOrder
-- ----------------------------
DROP TABLE IF EXISTS "public"."CourseOrder";
CREATE TABLE "public"."CourseOrder" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "userId" int4 NOT NULL,
  "courseId" int4 NOT NULL,
  "chapterId" int4,
  "points" int4 NOT NULL,
  "progress" float8 NOT NULL DEFAULT 0,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "oneTimePayment" bool NOT NULL DEFAULT false,
  "oneTimePoint" int4
)
;

-- ----------------------------
-- Records of CourseOrder
-- ----------------------------
INSERT INTO "public"."CourseOrder" VALUES ('cme9cejfg0003uq44cz0uq0yh', 6, 31, 41, 0, 0, '2025-08-13 02:19:52.156', '2025-08-13 02:19:52.156', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9jqdci000duq44ce55eltm', 6, 31, 47, 43, 25.49999949148923, '2025-08-13 05:45:01.458', '2025-08-13 05:45:10.995', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme8suaqk000duqacd7m910gb', 6, 31, 39, 0, 56.218244990131, '2025-08-12 17:12:15.069', '2025-08-12 17:20:16.305', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9d51z40007uq44z59e1qer', 6, 31, 32, 555, 100, '2025-08-13 02:40:29.248', '2025-08-13 05:54:31.152', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme8k17yg0005uqacyshh2xap', 6, 31, 33, 0, 100, '2025-08-12 13:05:41.513', '2025-08-13 05:54:31.24', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme8tfyqf000fuqacpscadp6l', 6, 31, 35, 0, 100, '2025-08-12 17:29:05.943', '2025-08-13 05:54:31.298', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cmdvh7zba0001uqzstpqbna4k', 2, 28, 23, 0, 100, '2025-08-03 09:25:57.766', '2025-08-03 09:30:07.854', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cmdvjx76z0001uqxsxrmbp0j1', 2, 28, 24, 0, 0, '2025-08-03 10:41:33.612', '2025-08-03 10:41:33.612', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme8kdtop0007uqacwhleb31g', 6, 31, 34, 0, 100, '2025-08-12 13:15:29.545', '2025-08-13 05:54:31.356', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9d56y00009uq44nfs3kmhb', 6, 31, 43, 666, 100, '2025-08-13 02:40:35.688', '2025-08-13 05:54:31.71', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9ebsrb000buq4463aq9j60', 6, 31, 45, 0, 100, '2025-08-13 03:13:43.512', '2025-08-13 05:54:31.768', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9cnmtb0005uq44cifdokca', 6, 31, 44, 0, 100, '2025-08-13 02:26:56.448', '2025-08-13 05:54:31.836', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cmdvl6zyj0002uqwkqbnh4vhw', 1, 28, 23, 0, 100, '2025-08-03 11:17:10.411', '2025-08-11 10:46:29.351', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme87t0v80001uqacy7p5ersl', 6, 29, NULL, 555, 31.95480981565405, '2025-08-12 07:23:23.685', '2025-08-12 10:55:19.968', 't', 555);
INSERT INTO "public"."CourseOrder" VALUES ('cme8gpf180003uqaccvfai34j', 6, 30, 30, 2, 0, '2025-08-12 11:32:31.964', '2025-08-12 11:32:31.964', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme8lugsy0009uqacxqlbriem', 6, 31, 38, 0, 0, '2025-08-12 13:56:25.618', '2025-08-12 13:56:25.618', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme8mi2za000buqacjrel5mg8', 6, 31, 37, 0, 0, '2025-08-12 14:14:47.447', '2025-08-12 14:14:47.447', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9kpv17000fuq44tvch9zdu', 5, 31, 32, 555, 100, '2025-08-13 06:12:37.339', '2025-08-13 07:29:36.682', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9ks3d9000juq44q5dbjrr4', 5, 31, 33, 0, 100, '2025-08-13 06:14:21.454', '2025-08-13 07:29:36.875', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9ks3er000luq44vg0cksuf', 5, 31, 35, 0, 100, '2025-08-13 06:14:21.507', '2025-08-13 07:29:36.973', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9ks3g6000nuq44dw47e316', 5, 31, 34, 0, 100, '2025-08-13 06:14:21.558', '2025-08-13 07:29:37.169', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9kqh86000huq4494plsrtj', 5, 31, 43, 666, 100, '2025-08-13 06:13:06.103', '2025-08-13 07:29:37.874', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9ks3ot000puq44gv9hcga6', 5, 31, 45, 0, 100, '2025-08-13 06:14:21.736', '2025-08-13 07:29:38.052', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9ks3rt000ruq44mvgvmia2', 5, 31, 44, 0, 100, '2025-08-13 06:14:21.977', '2025-08-13 07:29:38.15', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9nh2v2000tuq44nspvm4hs', 5, 32, 52, 2, 22.68181774293515, '2025-08-13 07:29:46.43', '2025-08-13 07:29:54.003', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9o0stx000wuq44t149uzhs', 1, 32, 52, 2, 0, '2025-08-13 07:45:06.55', '2025-08-13 07:45:06.55', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9o0y5p000yuq44op9mgrxo', 1, 32, 53, 23, 0, '2025-08-13 07:45:13.454', '2025-08-13 07:45:13.454', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9osc510010uq444m5bki5y', 1, 33, 56, 0, 0, '2025-08-13 08:06:31.286', '2025-08-13 08:06:31.286', 'f', NULL);
INSERT INTO "public"."CourseOrder" VALUES ('cme9ou01d0012uq44tb45b3zh', 5, 33, 56, 23, 0, '2025-08-13 08:07:48.913', '2025-08-13 08:07:48.913', 'f', NULL);

-- ----------------------------
-- Table structure for CourseRating
-- ----------------------------
DROP TABLE IF EXISTS "public"."CourseRating";
CREATE TABLE "public"."CourseRating" (
  "id" int4 NOT NULL DEFAULT nextval('"CourseRating_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "courseId" int4 NOT NULL,
  "isAnonymous" bool NOT NULL DEFAULT false,
  "descriptionRating" int4 NOT NULL DEFAULT 5,
  "valueRating" int4 NOT NULL DEFAULT 5,
  "teachingRating" int4 NOT NULL DEFAULT 5,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of CourseRating
-- ----------------------------
INSERT INTO "public"."CourseRating" VALUES (2, 1, 28, 't', 5, 5, 5, '2025-08-11 10:50:26.568');
INSERT INTO "public"."CourseRating" VALUES (3, 6, 28, 'f', 3, 5, 3, '2025-08-11 11:04:39.356');
INSERT INTO "public"."CourseRating" VALUES (4, 5, 32, 'f', 3, 2, 1, '2025-08-13 07:36:47.67');
INSERT INTO "public"."CourseRating" VALUES (5, 1, 32, 't', 4, 1, 4, '2025-08-13 07:44:47.428');

-- ----------------------------
-- Table structure for ForumCategory
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumCategory";
CREATE TABLE "public"."ForumCategory" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumCategory_id_seq"'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of ForumCategory
-- ----------------------------
INSERT INTO "public"."ForumCategory" VALUES (2, '（现金奖励）投稿请加VX: h0XT0nh0u', '2025-07-26 02:50:27.991', '2025-07-26 02:50:27.991');
INSERT INTO "public"."ForumCategory" VALUES (1, '伽玛社区-CTFer和春秋杯的赛事宇宙', '2025-07-26 02:50:17.906', '2025-07-26 02:50:39.578');
INSERT INTO "public"."ForumCategory" VALUES (3, '春秋匠心', '2025-07-26 02:50:49.945', '2025-07-26 02:50:49.945');
INSERT INTO "public"."ForumCategory" VALUES (4, '资源分享区【下载后务必检查安全性】', '2025-07-26 02:50:57.011', '2025-07-26 02:50:57.011');

-- ----------------------------
-- Table structure for ForumComment
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumComment";
CREATE TABLE "public"."ForumComment" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumComment_id_seq"'::regclass),
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "authorId" int4 NOT NULL,
  "postId" int4 NOT NULL,
  "parentId" int4,
  "likeCount" int4 NOT NULL DEFAULT 0,
  "dislikeCount" int4 NOT NULL DEFAULT 0,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of ForumComment
-- ----------------------------
INSERT INTO "public"."ForumComment" VALUES (1, '<p>fsdafasfd</p>', 1, 1, NULL, 0, 0, '2025-07-26 07:46:48.428', '2025-07-26 07:46:48.428');
INSERT INTO "public"."ForumComment" VALUES (2, '<p>fsadfasfd</p>', 1, 1, NULL, 0, 0, '2025-07-26 07:46:52.095', '2025-07-26 07:46:52.095');
INSERT INTO "public"."ForumComment" VALUES (3, '<p>2323</p>', 1, 1, NULL, 0, 0, '2025-07-26 07:46:58.149', '2025-07-26 07:46:58.149');
INSERT INTO "public"."ForumComment" VALUES (7, '<p>发撒的发生发撒的法撒旦方啊</p>', 1, 2, NULL, 0, 0, '2025-07-26 09:27:10.488', '2025-07-26 09:27:10.488');
INSERT INTO "public"."ForumComment" VALUES (8, '<p>广东省广东撒干撒搭嘎是</p>', 1, 2, NULL, 0, 0, '2025-07-26 09:27:14.648', '2025-07-26 09:27:14.648');
INSERT INTO "public"."ForumComment" VALUES (9, '<p>范德萨发撒旦法艾师傅萨芬</p>', 1, 2, NULL, 0, 0, '2025-07-26 09:27:18.665', '2025-07-26 09:27:18.665');
INSERT INTO "public"."ForumComment" VALUES (10, '<p>方法</p>', 1, 2, NULL, 0, 0, '2025-07-26 09:27:26.179', '2025-07-26 09:27:26.179');
INSERT INTO "public"."ForumComment" VALUES (4, '<p>发电房</p>', 1, 2, NULL, 1, 1, '2025-07-26 08:12:53.134', '2025-07-26 13:40:28.57');
INSERT INTO "public"."ForumComment" VALUES (6, '<p>滚滚滚</p>', 1, 2, NULL, 1, 0, '2025-07-26 09:27:05.66', '2025-07-26 14:19:00.313');
INSERT INTO "public"."ForumComment" VALUES (5, '<p>哈哈哈</p>', 1, 2, NULL, 1, 1, '2025-07-26 08:13:04.191', '2025-07-26 14:19:03.425');
INSERT INTO "public"."ForumComment" VALUES (11, '<p>防守打法撒发生发</p>', 1, 2, NULL, 1, 0, '2025-07-26 14:20:58.73', '2025-07-26 14:30:40.046');
INSERT INTO "public"."ForumComment" VALUES (17, '<p>你你你</p>', 1, 2, NULL, 0, 0, '2025-07-31 15:35:23.223', '2025-07-31 15:35:23.223');
INSERT INTO "public"."ForumComment" VALUES (18, '<p>挂号费</p>', 1, 2, NULL, 0, 0, '2025-07-31 15:52:56.513', '2025-07-31 15:52:56.513');
INSERT INTO "public"."ForumComment" VALUES (19, '<p>个</p>', 1, 2, 4, 0, 0, '2025-07-31 15:53:12.905', '2025-07-31 15:53:12.905');
INSERT INTO "public"."ForumComment" VALUES (20, '<p>范德萨</p>', 1, 2, 4, 0, 0, '2025-07-31 15:55:07.046', '2025-07-31 15:55:07.046');
INSERT INTO "public"."ForumComment" VALUES (24, '<p>滚滚滚撒</p>', 1, 2, NULL, 0, 0, '2025-08-03 13:10:52.792', '2025-08-03 13:10:52.792');
INSERT INTO "public"."ForumComment" VALUES (25, '<p>方法是</p><p><br></p>', 1, 2, NULL, 0, 0, '2025-08-03 13:11:00.583', '2025-08-03 13:11:00.583');
INSERT INTO "public"."ForumComment" VALUES (27, '<p>滚滚滚</p>', 1, 4, 26, 0, 0, '2025-08-04 13:22:17.619', '2025-08-04 13:22:17.619');
INSERT INTO "public"."ForumComment" VALUES (26, '<p>范德萨发</p>', 1, 4, NULL, 1, 0, '2025-08-04 13:22:09.004', '2025-08-04 13:22:21.304');
INSERT INTO "public"."ForumComment" VALUES (28, '<p>二二额废物 </p>', 6, 5, NULL, 0, 0, '2025-08-12 10:23:49.723', '2025-08-12 10:23:49.723');

-- ----------------------------
-- Table structure for ForumCommentDislike
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumCommentDislike";
CREATE TABLE "public"."ForumCommentDislike" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumCommentDislike_id_seq"'::regclass),
  "commentId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of ForumCommentDislike
-- ----------------------------
INSERT INTO "public"."ForumCommentDislike" VALUES (2, 4, 1, '2025-07-26 13:40:28.543');
INSERT INTO "public"."ForumCommentDislike" VALUES (3, 5, 1, '2025-07-26 14:19:03.371');

-- ----------------------------
-- Table structure for ForumCommentLike
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumCommentLike";
CREATE TABLE "public"."ForumCommentLike" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumCommentLike_id_seq"'::regclass),
  "commentId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of ForumCommentLike
-- ----------------------------
INSERT INTO "public"."ForumCommentLike" VALUES (1, 4, 1, '2025-07-26 13:40:13.775');
INSERT INTO "public"."ForumCommentLike" VALUES (2, 5, 1, '2025-07-26 14:18:51.19');
INSERT INTO "public"."ForumCommentLike" VALUES (3, 6, 1, '2025-07-26 14:19:00.285');
INSERT INTO "public"."ForumCommentLike" VALUES (4, 11, 1, '2025-07-26 14:30:39.989');
INSERT INTO "public"."ForumCommentLike" VALUES (6, 26, 1, '2025-08-04 13:22:21.236');

-- ----------------------------
-- Table structure for ForumCommentReport
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumCommentReport";
CREATE TABLE "public"."ForumCommentReport" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumCommentReport_id_seq"'::regclass),
  "commentId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of ForumCommentReport
-- ----------------------------
INSERT INTO "public"."ForumCommentReport" VALUES (1, 4, 1, '范德萨发第三方', '2025-07-26 13:40:32.384');
INSERT INTO "public"."ForumCommentReport" VALUES (2, 5, 1, '与他人羊肉汤', '2025-07-26 14:19:09.792');
INSERT INTO "public"."ForumCommentReport" VALUES (4, 26, 1, '方法', '2025-08-04 13:22:29.67');

-- ----------------------------
-- Table structure for ForumPost
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumPost";
CREATE TABLE "public"."ForumPost" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumPost_id_seq"'::regclass),
  "title" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "authorId" int4 NOT NULL,
  "isTop" bool NOT NULL DEFAULT false,
  "isEssence" bool NOT NULL DEFAULT false,
  "isHot" bool NOT NULL DEFAULT false,
  "isNewbie" bool NOT NULL DEFAULT false,
  "status" "public"."PostStatus" NOT NULL DEFAULT 'PENDING'::"PostStatus",
  "likeCount" int4 NOT NULL DEFAULT 0,
  "commentCount" int4 NOT NULL DEFAULT 0,
  "viewCount" int4 NOT NULL DEFAULT 0,
  "sectionId" int4 NOT NULL,
  "coverUrl" varchar(500) COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "isDeleted" bool NOT NULL DEFAULT false
)
;

-- ----------------------------
-- Records of ForumPost
-- ----------------------------
INSERT INTO "public"."ForumPost" VALUES (4, '测试标题33', '<p>测试标题测试标题测试标题<img src="https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/04/baaf7d66-bd52-499f-8562-037ed6dd4cdd.png" alt="" data-href="" width="" height="" style="width: 317.00px;height: 400.28px;"/></p>', 1, 't', 'f', 'f', 'f', 'PENDING', 0, 2, 4, 6, NULL, '2025-08-04 13:21:11.338', '2025-08-04 13:37:30.369', 'f');
INSERT INTO "public"."ForumPost" VALUES (1, '范德萨发', '<p>范德萨方的</p>', 1, 'f', 'f', 'f', 'f', 'PUBLISHED', 0, 3, 44, 1, NULL, '2025-07-26 06:37:38.496', '2025-08-04 14:01:29.293', 'f');
INSERT INTO "public"."ForumPost" VALUES (2, 'ggg', '<p>u已经一天一天圩一天 雨天士<img src="https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/28/c58c668f-4cdc-4a16-a50d-527becd2b208.png" alt="" data-href="" width="" height="" style=""/></p>', 1, 't', 'f', 'f', 'f', 'PUBLISHED', 0, 20, 142, 1, NULL, '2025-07-26 07:50:32.191', '2025-08-10 17:12:57.228', 'f');
INSERT INTO "public"."ForumPost" VALUES (6, 'fsdafsadf', '<p>2323</p>', 6, 'f', 'f', 'f', 'f', 'PENDING', 0, 0, 0, 1, NULL, '2025-08-10 17:28:16.948', '2025-08-10 17:28:16.948', 'f');
INSERT INTO "public"."ForumPost" VALUES (7, '水岸东方撒旦法师法师', '<p>范德萨发发<span style="color: rgb(8, 151, 156);">生发水岸东方水岸东方撒范德萨范德萨发的艾师傅艾师傅</span></p><p><br></p><p><span style="color: rgb(0, 0, 0);">分挖方士大夫算法士大夫</span></p>', 5, 'f', 'f', 'f', 'f', 'PENDING', 0, 0, 0, 1, NULL, '2025-08-13 08:35:20.678', '2025-08-13 08:35:20.678', 'f');
INSERT INTO "public"."ForumPost" VALUES (9, '新的', '<p>55555</p>', 6, 'f', 'f', 'f', 'f', 'PENDING', 0, 0, 0, 1, NULL, '2025-08-13 09:10:39.846', '2025-08-13 09:10:39.846', 'f');
INSERT INTO "public"."ForumPost" VALUES (5, '习近平', '<p>习近平</p>', 1, 't', 't', 't', 'f', 'PUBLISHED', 0, 1, 9, 1, NULL, '2025-08-04 14:05:28.926', '2025-08-14 07:13:14.961', 'f');
INSERT INTO "public"."ForumPost" VALUES (10, '广东省法撒旦法撒旦', '<p> 防守打法水岸东方阿斯蒂芬阿斯蒂芬水岸东方阿萨德发撒的范德萨方</p>', 1, 'f', 'f', 'f', 'f', 'PENDING', 0, 0, 0, 1, NULL, '2025-08-14 16:28:10.025', '2025-08-14 16:28:10.025', 'f');
INSERT INTO "public"."ForumPost" VALUES (8, '新的帖子', '<p>234324324324324</p>', 5, 'f', 't', 'f', 'f', 'PENDING', 0, 0, 0, 1, NULL, '2025-08-13 08:43:52.403', '2025-08-14 16:29:41.578', 'f');

-- ----------------------------
-- Table structure for ForumPostFavorite
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumPostFavorite";
CREATE TABLE "public"."ForumPostFavorite" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumPostFavorite_id_seq"'::regclass),
  "postId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of ForumPostFavorite
-- ----------------------------
INSERT INTO "public"."ForumPostFavorite" VALUES (2, 1, 1, '2025-08-04 13:07:57.338');

-- ----------------------------
-- Table structure for ForumPostLike
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumPostLike";
CREATE TABLE "public"."ForumPostLike" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumPostLike_id_seq"'::regclass),
  "postId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of ForumPostLike
-- ----------------------------

-- ----------------------------
-- Table structure for ForumPostReport
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumPostReport";
CREATE TABLE "public"."ForumPostReport" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumPostReport_id_seq"'::regclass),
  "postId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of ForumPostReport
-- ----------------------------
INSERT INTO "public"."ForumPostReport" VALUES (1, 2, 1, '发撒的发生发撒的发撒', '2025-07-26 15:48:35.722');

-- ----------------------------
-- Table structure for ForumSection
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumSection";
CREATE TABLE "public"."ForumSection" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumSection_id_seq"'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "coverUrl" varchar(500) COLLATE "pg_catalog"."default",
  "categoryId" int4 NOT NULL,
  "moderatorId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastPostAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "postCount" int4 NOT NULL DEFAULT 0,
  "sort" int4 NOT NULL DEFAULT 0,
  "parentId" int4,
  "announcement" text COLLATE "pg_catalog"."default",
  "favoriteCount" int4 NOT NULL DEFAULT 0,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of ForumSection
-- ----------------------------
INSERT INTO "public"."ForumSection" VALUES (3, '新股', '新股', NULL, 4, 6, '2025-07-30 13:45:03.042', '2025-07-30 13:45:03.042', 0, 0, 1, '新股新股', 0, '2025-07-30 13:45:03.042');
INSERT INTO "public"."ForumSection" VALUES (4, '前端', '前端', NULL, 3, 2, '2025-07-30 13:45:32.138', '2025-07-30 13:45:32.138', 0, 0, NULL, '前端前端前端前端前端', 0, '2025-07-30 13:45:32.138');
INSERT INTO "public"."ForumSection" VALUES (5, '后端', '后端后端后端', NULL, 1, 5, '2025-07-30 13:45:49.886', '2025-07-30 13:45:49.886', 0, 0, NULL, '后端后端后端', 0, '2025-07-30 13:45:49.886');
INSERT INTO "public"."ForumSection" VALUES (7, '单机游戏', '单机游戏', NULL, 4, 5, '2025-08-01 15:24:40.706', '2025-08-01 15:24:40.706', 0, 0, 6, '单机游戏单机游戏单机游戏单机游戏单机游戏', 0, '2025-08-01 15:24:40.706');
INSERT INTO "public"."ForumSection" VALUES (8, '网络游戏', '网络游戏网络游戏网络游戏', NULL, 4, 5, '2025-08-01 15:24:59.987', '2025-08-01 15:24:59.987', 0, 0, 6, '网络游戏网络游戏', 0, '2025-08-01 15:24:59.987');
INSERT INTO "public"."ForumSection" VALUES (10, '手机游戏', '手机游戏手机游戏', NULL, 4, 12, '2025-08-04 13:19:51.966', '2025-08-04 13:19:51.966', 0, 0, 6, '手机游戏', 0, '2025-08-04 13:19:51.966');
INSERT INTO "public"."ForumSection" VALUES (6, '游戏', '游戏', NULL, 4, 2, '2025-07-30 13:46:05.859', '2025-08-04 13:21:11.563', 1, 0, NULL, '游戏游戏游戏游戏', 1, '2025-08-04 13:21:53.175');
INSERT INTO "public"."ForumSection" VALUES (1, '白帽子技术/思路', '白帽子分享技术/思路的地方。
欢迎各路豪杰加入i春秋 战国微信群（秦楚齐燕赵魏韩）添加VX：h0XT0nh0u 开启江湖征程！', NULL, 2, 6, '2025-07-26 03:04:01.798', '2025-08-14 16:28:10.213', 8, 0, NULL, NULL, 1, '2025-08-14 16:28:10.214');

-- ----------------------------
-- Table structure for ForumSectionFavorite
-- ----------------------------
DROP TABLE IF EXISTS "public"."ForumSectionFavorite";
CREATE TABLE "public"."ForumSectionFavorite" (
  "id" int4 NOT NULL DEFAULT nextval('"ForumSectionFavorite_id_seq"'::regclass),
  "sectionId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of ForumSectionFavorite
-- ----------------------------
INSERT INTO "public"."ForumSectionFavorite" VALUES (1, 1, 1, '2025-07-26 11:04:15.217');
INSERT INTO "public"."ForumSectionFavorite" VALUES (2, 6, 1, '2025-08-04 13:21:53.123');

-- ----------------------------
-- Table structure for Game
-- ----------------------------
DROP TABLE IF EXISTS "public"."Game";
CREATE TABLE "public"."Game" (
  "id" int4 NOT NULL DEFAULT nextval('"Game_id_seq"'::regclass),
  "name" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "announcement" text COLLATE "pg_catalog"."default",
  "carouselImages" jsonb,
  "status" "public"."GameStatus" NOT NULL DEFAULT 'ACTIVE'::"GameStatus",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "downloadLink" varchar(500) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of Game
-- ----------------------------
INSERT INTO "public"."Game" VALUES (1, 'cft', '范德萨发', '["https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/02/e8c27bf0-2358-450b-8079-21d003e566ca.png"]', 'ACTIVE', '2025-08-02 08:25:48.846', '2025-08-02 08:25:48.846', 'http://localhost:3000/games');
INSERT INTO "public"."Game" VALUES (2, 'fdsf', 'fds fdsfds', '["https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/02/eaf87aab-a216-469b-ba05-1d78dce4f726.png", "https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/02/923bd69c-2697-4a70-87df-0d6b80d45534.png", "https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/02/3bad83e6-5397-4420-a8fc-4e008fa1961f.png", "https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/02/fa308037-1d10-44bd-876b-9601a68fc971.png", "https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/02/649d2bac-6780-49f2-b5e3-6a2d2af47d77.png"]', 'ACTIVE', '2025-08-02 08:26:20.787', '2025-08-02 08:26:20.787', 'http://localhost:3000/games');

-- ----------------------------
-- Table structure for GameRegistration
-- ----------------------------
DROP TABLE IF EXISTS "public"."GameRegistration";
CREATE TABLE "public"."GameRegistration" (
  "id" int4 NOT NULL DEFAULT nextval('"GameRegistration_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "gameId" int4 NOT NULL,
  "status" "public"."GameRegistrationStatus" NOT NULL DEFAULT 'REGISTERED'::"GameRegistrationStatus",
  "registeredAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of GameRegistration
-- ----------------------------
INSERT INTO "public"."GameRegistration" VALUES (1, 1, 1, 'REGISTERED', '2025-08-02 08:55:55.408', '2025-08-02 08:55:55.411', '2025-08-02 08:55:55.411');
INSERT INTO "public"."GameRegistration" VALUES (2, 1, 2, 'REGISTERED', '2025-08-04 13:34:39.975', '2025-08-04 13:34:39.976', '2025-08-04 13:34:39.976');

-- ----------------------------
-- Table structure for Order
-- ----------------------------
DROP TABLE IF EXISTS "public"."Order";
CREATE TABLE "public"."Order" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "orderNo" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" "public"."OrderType" NOT NULL,
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING'::"OrderStatus",
  "paymentMethod" "public"."PaymentMethod" NOT NULL,
  "paymentTime" timestamp(3),
  "paymentNo" text COLLATE "pg_catalog"."default",
  "refundTime" timestamp(3),
  "refundNo" text COLLATE "pg_catalog"."default",
  "userId" int4,
  "courseId" int4,
  "taskId" int4,
  "remark" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "expiredAt" timestamp(3) NOT NULL,
  "metadata" jsonb
)
;

-- ----------------------------
-- Records of Order
-- ----------------------------
INSERT INTO "public"."Order" VALUES ('cmdbeau1b0003uq7wbdapze48', 'dpnnNIXaSXm8wih3T1J0', 'RECHARGE', '充值50元', 5000.00, 'PENDING', 'ALIPAY', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-07-20 08:08:48.528', '2025-07-20 08:08:48.528', '2025-08-19 08:08:48.526', NULL);
INSERT INTO "public"."Order" VALUES ('cmdeh9vxs0005uqwc1jw60igx', 'hFiIxvReJP7D5OL7td2A', 'RECHARGE', '充值10元', 1000.00, 'PENDING', 'ALIPAY', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-07-22 11:55:21.712', '2025-07-22 11:55:21.712', '2025-08-21 11:55:21.694', NULL);
INSERT INTO "public"."Order" VALUES ('cmdehjblu0007uqwcueigub77', 'HuoBRUkZx4EIci7R2SE4', 'RECHARGE', '充值10元', 1000.00, 'PENDING', 'ALIPAY', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-07-22 12:02:41.922', '2025-07-22 12:02:41.922', '2025-08-21 12:02:41.921', NULL);
INSERT INTO "public"."Order" VALUES ('cmdeirx430001uqbczurcg5n5', 'ThYqF1FwJgbwV7Xo7Bnm', 'RECHARGE', '充值10元', 1000.00, 'PAID', 'ALIPAY', '2025-07-22 12:38:07.79', NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-07-22 12:37:22.66', '2025-07-22 12:38:07.791', '2025-08-21 12:37:22.659', NULL);
INSERT INTO "public"."Order" VALUES ('cmdej0z140001rz7t46yi3fzn', 'ZbzyjfRuqfAedyA8oDQf', 'RECHARGE', '充值500元', 50000.00, 'PAID', 'ALIPAY', '2025-07-22 12:44:57.54', NULL, NULL, NULL, 5, NULL, NULL, NULL, '2025-07-22 12:44:25.048', '2025-07-22 12:44:57.542', '2025-08-21 12:44:25.046', NULL);
INSERT INTO "public"."Order" VALUES ('cmdej5kdd0003uqbclpmbfqc0', 'guQ9MWayd6bmhh6dfNVx', 'RECHARGE', '充值50元', 5000.00, 'PAID', 'ALIPAY', '2025-07-22 12:48:52.638', NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-07-22 12:47:59.329', '2025-07-22 12:48:52.639', '2025-08-21 12:47:59.328', NULL);
INSERT INTO "public"."Order" VALUES ('cmdem4n550007uqbcv73w6qty', 'tEPbd4FeXvHh6FHD6Wom', 'RECHARGE', '充值50元', 5000.00, 'PAID', 'ALIPAY', '2025-07-22 14:12:02.733', NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-07-22 14:11:15.114', '2025-07-22 14:12:02.734', '2025-08-21 14:11:15.112', NULL);
INSERT INTO "public"."Order" VALUES ('cmdn7hzzy0001uqu05u9u3nbo', 'TASK_1753713099644_q6kqgs38w', 'TASK', '任务发布 - 版本', 100.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 5, NULL, 2, '发布任务：版本', '2025-07-28 14:31:39.646', '2025-07-28 14:31:39.646', '2025-08-27 14:31:39.644', NULL);
INSERT INTO "public"."Order" VALUES ('cmdn89wt60003uqu0rk3k73hs', 'REFUND_1753714401881_qts7bt4z5', 'TASK', '任务删除退款 - 版本', 90.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 5, NULL, 2, '任务删除退款，原任务：版本', '2025-07-28 14:53:21.882', '2025-07-28 14:53:21.882', '2025-08-27 14:53:21.881', NULL);
INSERT INTO "public"."Order" VALUES ('cmdom4mdh0001uql83o2ioom1', 'TASK_1753798135875_omjf6xunn', 'TASK', '任务发布 - 范德萨发', 100.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 1, NULL, 3, '发布任务：范德萨发', '2025-07-29 14:08:55.877', '2025-07-29 14:08:55.877', '2025-08-28 14:08:55.876', NULL);
INSERT INTO "public"."Order" VALUES ('cmdtmjxca0001uqa8t2xlglwq', 'POINTS_1754101180807_frgyg6c0e', 'RECHARGE', '积分增加 - sss', 22.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 6, NULL, NULL, '管理员操作：sss', '2025-08-02 02:19:40.809', '2025-08-02 02:19:40.809', '2025-08-03 02:19:40.807', '{"type": "points_change", "change": 22, "reason": "sss", "operator": 1, "operatorName": "admin"}');
INSERT INTO "public"."Order" VALUES ('cmdtmkwq30003uqa8olu41md4', 'POINTS_1754101226666_qcchzdm7u', 'RECHARGE', '积分增加 - fdsf', 553.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 12, NULL, NULL, '管理员操作：fdsf', '2025-08-02 02:20:26.668', '2025-08-02 02:20:26.668', '2025-08-03 02:20:26.666', '{"type": "points_change", "change": 553, "reason": "fdsf", "operator": 1, "operatorName": "admin"}');
INSERT INTO "public"."Order" VALUES ('cmdtmlaaj0005uqa8u5nnxazf', 'POINTS_1754101244250_5hnenrkhz', 'RECHARGE', '积分增加 - ss', 22.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 12, NULL, NULL, '管理员操作：ss', '2025-08-02 02:20:44.251', '2025-08-02 02:20:44.251', '2025-08-03 02:20:44.25', '{"type": "points_change", "change": 22, "reason": "ss", "operator": 1, "operatorName": "admin"}');
INSERT INTO "public"."Order" VALUES ('cmdvqqudn0001uqx05ue63po2', 'TASK_1754229154377_ibdqpquxp', 'TASK', '任务发布 - 任务测试', 100.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 1, NULL, 4, '发布任务：任务测试', '2025-08-03 13:52:34.379', '2025-08-03 13:52:34.379', '2025-09-02 13:52:34.377', NULL);
INSERT INTO "public"."Order" VALUES ('cmdx58xiv0001uq5w3gwseg5i', 'TASK_1754313979061_mj43uefme', 'TASK', '任务发布 - 测试任务', 100.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 1, NULL, 5, '发布任务：测试任务', '2025-08-04 13:26:19.063', '2025-08-04 13:26:19.063', '2025-09-03 13:26:19.061', NULL);
INSERT INTO "public"."Order" VALUES ('cmdx5t22r0001uqb4juz4t3yj', 'POINTS_1754314918082_2zumdp9n8', 'RECHARGE', '积分增加 - 333', 100.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 12, NULL, NULL, '管理员操作：333', '2025-08-04 13:41:58.083', '2025-08-04 13:41:58.083', '2025-08-05 13:41:58.082', '{"type": "points_change", "change": 100, "reason": "333", "operator": 1, "operatorName": "admin"}');
INSERT INTO "public"."Order" VALUES ('cmdx5texh0003uqb4z9nkpsz7', 'POINTS_1754314934741_rfny7jdxw', 'RECHARGE', '积分减少 - ss', 104.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 12, NULL, NULL, '管理员操作：ss', '2025-08-04 13:42:14.742', '2025-08-04 13:42:14.742', '2025-08-05 13:42:14.741', '{"type": "points_change", "change": -104, "reason": "ss", "operator": 1, "operatorName": "admin"}');
INSERT INTO "public"."Order" VALUES ('cme9uhgdm0014uq44xm6jlbq1', 'TASK_1755081961257_my1vk2c9l', 'TASK', '任务发布 - 标题1', 100.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 6, NULL, 6, '发布任务：标题1', '2025-08-13 10:46:01.258', '2025-08-13 10:46:01.258', '2025-09-12 10:46:01.257', NULL);
INSERT INTO "public"."Order" VALUES ('cmeb414c60001uqo0v2yiik6j', 'TASK_1755158461492_j7hjsw02m', 'TASK', '任务发布 - 包体2', 55.00, 'PAID', 'BALANCE', NULL, NULL, NULL, NULL, 1, NULL, 7, '发布任务：包体2', '2025-08-14 08:01:01.495', '2025-08-14 08:01:01.495', '2025-09-13 08:01:01.493', NULL);
INSERT INTO "public"."Order" VALUES ('cmeblp2100001uqysjsvntfg9', 'Gl9PL0dEpI9o150XX3zv', 'RECHARGE', '充值10元', 1000.00, 'PAID', 'ALIPAY', '2025-08-14 16:16:04.613', NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-08-14 16:15:31.714', '2025-08-14 16:16:04.615', '2025-09-13 16:15:31.711', NULL);

-- ----------------------------
-- Table structure for Permission
-- ----------------------------
DROP TABLE IF EXISTS "public"."Permission";
CREATE TABLE "public"."Permission" (
  "id" int4 NOT NULL DEFAULT nextval('"Permission_id_seq"'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "resource" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "isEnabled" bool NOT NULL DEFAULT true,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of Permission
-- ----------------------------
INSERT INTO "public"."Permission" VALUES (29, '仪表盘', '仪表盘页面访问权限', 'DASHBOARD', 't', '2025-08-10 15:25:26.966', '2025-08-10 15:25:26.966');
INSERT INTO "public"."Permission" VALUES (30, '文章管理', '文章管理页面访问权限', 'ARTICLE', 't', '2025-08-10 15:25:27.041', '2025-08-10 15:25:27.041');
INSERT INTO "public"."Permission" VALUES (31, '文章评论', '文章评论管理页面访问权限', 'ARTICLE_COMMENT', 't', '2025-08-10 15:25:27.069', '2025-08-10 15:25:27.069');
INSERT INTO "public"."Permission" VALUES (32, '文章分类', '文章分类管理页面访问权限', 'ARTICLE_CATEGORY', 't', '2025-08-10 15:25:27.097', '2025-08-10 15:25:27.097');
INSERT INTO "public"."Permission" VALUES (33, '课程管理', '课程管理页面访问权限', 'COURSE', 't', '2025-08-10 15:25:27.127', '2025-08-10 15:25:27.127');
INSERT INTO "public"."Permission" VALUES (34, '课程分类', '课程分类管理页面访问权限', 'COURSE_CATEGORY', 't', '2025-08-10 15:25:27.155', '2025-08-10 15:25:27.155');
INSERT INTO "public"."Permission" VALUES (35, '课程方向', '课程方向管理页面访问权限', 'COURSE_DIRECTION', 't', '2025-08-10 15:25:27.183', '2025-08-10 15:25:27.183');
INSERT INTO "public"."Permission" VALUES (36, '课程评论', '课程评论管理页面访问权限', 'COURSE_COMMENT', 't', '2025-08-10 15:25:27.21', '2025-08-10 15:25:27.21');
INSERT INTO "public"."Permission" VALUES (37, '课程订单', '课程订单管理页面访问权限', 'COURSE_ORDER', 't', '2025-08-10 15:25:27.238', '2025-08-10 15:25:27.238');
INSERT INTO "public"."Permission" VALUES (38, '视频管理', '视频管理页面访问权限', 'VIDEO', 't', '2025-08-10 15:25:27.265', '2025-08-10 15:25:27.265');
INSERT INTO "public"."Permission" VALUES (39, '视频分类', '视频分类管理页面访问权限', 'VIDEO_CATEGORY', 't', '2025-08-10 15:25:27.293', '2025-08-10 15:25:27.293');
INSERT INTO "public"."Permission" VALUES (40, '视频评论', '视频评论管理页面访问权限', 'VIDEO_COMMENT', 't', '2025-08-10 15:25:27.321', '2025-08-10 15:25:27.321');
INSERT INTO "public"."Permission" VALUES (41, '论坛分类', '论坛板块分类管理页面访问权限', 'FORUM_CATEGORY', 't', '2025-08-10 15:25:27.349', '2025-08-10 15:25:27.349');
INSERT INTO "public"."Permission" VALUES (42, '论坛板块', '论坛板块管理页面访问权限', 'FORUM_SECTION', 't', '2025-08-10 15:25:27.377', '2025-08-10 15:25:27.377');
INSERT INTO "public"."Permission" VALUES (43, '论坛帖子', '论坛帖子管理页面访问权限', 'FORUM_POST', 't', '2025-08-10 15:25:27.404', '2025-08-10 15:25:27.404');
INSERT INTO "public"."Permission" VALUES (44, '论坛评论', '论坛帖子评论管理页面访问权限', 'FORUM_COMMENT', 't', '2025-08-10 15:25:27.433', '2025-08-10 15:25:27.433');
INSERT INTO "public"."Permission" VALUES (45, '评论举报', '论坛评论举报管理页面访问权限', 'FORUM_COMMENT_REPORT', 't', '2025-08-10 15:25:27.461', '2025-08-10 15:25:27.461');
INSERT INTO "public"."Permission" VALUES (46, '帖子举报', '论坛帖子举报管理页面访问权限', 'FORUM_POST_REPORT', 't', '2025-08-10 15:25:27.488', '2025-08-10 15:25:27.488');
INSERT INTO "public"."Permission" VALUES (47, '接单管理', '接单平台管理页面访问权限', 'TASK', 't', '2025-08-10 15:25:27.516', '2025-08-10 15:25:27.516');
INSERT INTO "public"."Permission" VALUES (48, '接单分类', '接单分类管理页面访问权限', 'TASK_CATEGORY', 't', '2025-08-10 15:25:27.543', '2025-08-10 15:25:27.543');
INSERT INTO "public"."Permission" VALUES (49, '接单评论', '接单评论管理页面访问权限', 'TASK_COMMENT', 't', '2025-08-10 15:25:27.57', '2025-08-10 15:25:27.57');
INSERT INTO "public"."Permission" VALUES (50, '接单订单', '接单订单管理页面访问权限', 'TASK_ORDER', 't', '2025-08-10 15:25:27.597', '2025-08-10 15:25:27.597');
INSERT INTO "public"."Permission" VALUES (51, '游戏管理', '游戏管理页面访问权限', 'GAME', 't', '2025-08-10 15:25:27.624', '2025-08-10 15:25:27.624');
INSERT INTO "public"."Permission" VALUES (52, '游戏分类', '游戏分类管理页面访问权限', 'GAME_CATEGORY', 't', '2025-08-10 15:25:27.651', '2025-08-10 15:25:27.651');
INSERT INTO "public"."Permission" VALUES (53, '游戏题库', '游戏题库管理页面访问权限', 'GAME_QUESTION', 't', '2025-08-10 15:25:27.678', '2025-08-10 15:25:27.678');
INSERT INTO "public"."Permission" VALUES (54, '用户管理', '用户管理页面访问权限', 'USER', 't', '2025-08-10 15:25:27.706', '2025-08-10 15:25:27.706');
INSERT INTO "public"."Permission" VALUES (55, '管理员管理', '管理员管理页面访问权限', 'ADMIN', 't', '2025-08-10 15:25:27.734', '2025-08-10 15:25:27.734');
INSERT INTO "public"."Permission" VALUES (56, '角色管理', '角色管理页面访问权限', 'ROLE', 't', '2025-08-10 15:25:27.761', '2025-08-10 15:25:27.761');
INSERT INTO "public"."Permission" VALUES (57, '权限管理', '权限管理页面访问权限', 'PERMISSION', 't', '2025-08-10 15:25:27.788', '2025-08-10 15:25:27.788');
INSERT INTO "public"."Permission" VALUES (58, '订单管理', '订单管理页面访问权限', 'ORDER', 't', '2025-08-10 15:25:27.815', '2025-08-10 15:25:27.815');
INSERT INTO "public"."Permission" VALUES (59, '网站配置', '网站配置页面访问权限', 'CONFIG', 't', '2025-08-10 15:25:27.844', '2025-08-10 15:25:27.844');

-- ----------------------------
-- Table structure for RegisterOrder
-- ----------------------------
DROP TABLE IF EXISTS "public"."RegisterOrder";
CREATE TABLE "public"."RegisterOrder" (
  "id" int4 NOT NULL DEFAULT nextval('"RegisterOrder_id_seq"'::regclass),
  "orderNo" text COLLATE "pg_catalog"."default" NOT NULL,
  "phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "nickname" text COLLATE "pg_catalog"."default" NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "status" text COLLATE "pg_catalog"."default" NOT NULL,
  "paymentNo" text COLLATE "pg_catalog"."default",
  "paymentTime" timestamp(3),
  "remark" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "password" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of RegisterOrder
-- ----------------------------
INSERT INTO "public"."RegisterOrder" VALUES (19, 'REGU9vCo14lsoXt8phI', '14215571240', '测试用户', 299.00, 'PAID', '2025072122001404170506835368', '2025-07-21 15:26:57.313', NULL, '2025-07-21 15:26:28.252', '2025-07-21 15:26:57.316', 'test1234');
INSERT INTO "public"."RegisterOrder" VALUES (20, 'REGxJiB23OAkwAXJBp7', '15804591054', '测试用户', 299.00, 'PENDING', NULL, NULL, NULL, '2025-07-21 15:30:11.083', '2025-07-21 15:30:11.083', 'test1234');
INSERT INTO "public"."RegisterOrder" VALUES (21, 'REG2lgSC8AOBePf_Oee', '19296393616', '测试用户', 299.00, 'PENDING', NULL, NULL, NULL, '2025-07-21 15:35:46.791', '2025-07-21 15:35:46.791', 'test1234');
INSERT INTO "public"."RegisterOrder" VALUES (22, 'REGj5gnMTi5mvZKsLbE', '19296393616', '测试用户', 299.00, 'PAID', '2025072122001404170506838317', '2025-07-21 15:40:55.615', NULL, '2025-07-21 15:39:57.185', '2025-07-21 15:40:55.617', 'test1234');
INSERT INTO "public"."RegisterOrder" VALUES (23, 'REGpPUZQvPBkuupdqdd', '17241296983', '测试用户', 299.00, 'PAID', '2025072222001404170506852331', '2025-07-22 13:11:11.288', NULL, '2025-07-22 13:10:42.091', '2025-07-22 13:11:11.29', 'test1234');
INSERT INTO "public"."RegisterOrder" VALUES (24, 'REG55dXkWakRG7xzy9O', '16414024746', '测试用户', 299.00, 'PENDING', NULL, NULL, NULL, '2025-07-22 13:51:47.754', '2025-07-22 13:51:47.754', 'test1234');

-- ----------------------------
-- Table structure for Role
-- ----------------------------
DROP TABLE IF EXISTS "public"."Role";
CREATE TABLE "public"."Role" (
  "id" int4 NOT NULL DEFAULT nextval('"Role_id_seq"'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "isEnabled" bool NOT NULL DEFAULT true,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of Role
-- ----------------------------
INSERT INTO "public"."Role" VALUES (6, '超级管理员', '超级管理员，拥有所有权限', 't', '2025-08-10 15:25:27.872', '2025-08-10 15:25:27.872');
INSERT INTO "public"."Role" VALUES (7, '系统管理员', '系统管理员，管理用户、角色、权限', 't', '2025-08-10 15:25:27.926', '2025-08-10 15:25:27.926');
INSERT INTO "public"."Role" VALUES (8, '内容管理员', '内容管理员，管理文章、课程、视频、论坛', 't', '2025-08-10 15:25:27.953', '2025-08-10 15:25:27.953');
INSERT INTO "public"."Role" VALUES (9, '论坛管理员', '论坛管理员，专门管理论坛相关内容', 't', '2025-08-10 15:25:27.98', '2025-08-10 15:25:27.98');
INSERT INTO "public"."Role" VALUES (10, '接单管理员', '接单平台管理员，管理接单相关业务', 't', '2025-08-10 15:25:28.008', '2025-08-10 15:25:28.008');
INSERT INTO "public"."Role" VALUES (11, '游戏管理员', '游戏管理员，管理游戏和题库', 't', '2025-08-10 15:25:28.035', '2025-08-10 15:25:28.035');
INSERT INTO "public"."Role" VALUES (12, '客服人员', '客服人员，查看用户信息和订单', 't', '2025-08-10 15:25:28.063', '2025-08-10 15:25:28.063');

-- ----------------------------
-- Table structure for RolePermission
-- ----------------------------
DROP TABLE IF EXISTS "public"."RolePermission";
CREATE TABLE "public"."RolePermission" (
  "id" int4 NOT NULL DEFAULT nextval('"RolePermission_id_seq"'::regclass),
  "roleId" int4 NOT NULL,
  "permissionId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of RolePermission
-- ----------------------------
INSERT INTO "public"."RolePermission" VALUES (58, 6, 29, '2025-08-10 15:25:28.197');
INSERT INTO "public"."RolePermission" VALUES (59, 6, 30, '2025-08-10 15:25:28.409');
INSERT INTO "public"."RolePermission" VALUES (60, 6, 31, '2025-08-10 15:25:28.539');
INSERT INTO "public"."RolePermission" VALUES (61, 6, 32, '2025-08-10 15:25:28.669');
INSERT INTO "public"."RolePermission" VALUES (62, 6, 33, '2025-08-10 15:25:28.799');
INSERT INTO "public"."RolePermission" VALUES (63, 6, 34, '2025-08-10 15:25:28.928');
INSERT INTO "public"."RolePermission" VALUES (64, 6, 35, '2025-08-10 15:25:29.058');
INSERT INTO "public"."RolePermission" VALUES (65, 6, 36, '2025-08-10 15:25:29.187');
INSERT INTO "public"."RolePermission" VALUES (66, 6, 37, '2025-08-10 15:25:29.317');
INSERT INTO "public"."RolePermission" VALUES (67, 6, 38, '2025-08-10 15:25:29.447');
INSERT INTO "public"."RolePermission" VALUES (68, 6, 39, '2025-08-10 15:25:29.575');
INSERT INTO "public"."RolePermission" VALUES (69, 6, 40, '2025-08-10 15:25:29.705');
INSERT INTO "public"."RolePermission" VALUES (70, 6, 41, '2025-08-10 15:25:29.834');
INSERT INTO "public"."RolePermission" VALUES (71, 6, 42, '2025-08-10 15:25:29.964');
INSERT INTO "public"."RolePermission" VALUES (72, 6, 43, '2025-08-10 15:25:30.093');
INSERT INTO "public"."RolePermission" VALUES (73, 6, 44, '2025-08-10 15:25:30.222');
INSERT INTO "public"."RolePermission" VALUES (74, 6, 45, '2025-08-10 15:25:30.352');
INSERT INTO "public"."RolePermission" VALUES (75, 6, 46, '2025-08-10 15:25:30.482');
INSERT INTO "public"."RolePermission" VALUES (76, 6, 47, '2025-08-10 15:25:30.612');
INSERT INTO "public"."RolePermission" VALUES (77, 6, 48, '2025-08-10 15:25:30.742');
INSERT INTO "public"."RolePermission" VALUES (78, 6, 49, '2025-08-10 15:25:30.872');
INSERT INTO "public"."RolePermission" VALUES (79, 6, 50, '2025-08-10 15:25:31.001');
INSERT INTO "public"."RolePermission" VALUES (80, 6, 51, '2025-08-10 15:25:31.131');
INSERT INTO "public"."RolePermission" VALUES (81, 6, 52, '2025-08-10 15:25:31.261');
INSERT INTO "public"."RolePermission" VALUES (82, 6, 53, '2025-08-10 15:25:31.39');
INSERT INTO "public"."RolePermission" VALUES (83, 6, 54, '2025-08-10 15:25:31.52');
INSERT INTO "public"."RolePermission" VALUES (84, 6, 55, '2025-08-10 15:25:31.649');
INSERT INTO "public"."RolePermission" VALUES (85, 6, 56, '2025-08-10 15:25:31.778');
INSERT INTO "public"."RolePermission" VALUES (86, 6, 57, '2025-08-10 15:25:31.908');
INSERT INTO "public"."RolePermission" VALUES (87, 6, 58, '2025-08-10 15:25:32.038');
INSERT INTO "public"."RolePermission" VALUES (88, 6, 59, '2025-08-10 15:25:32.168');
INSERT INTO "public"."RolePermission" VALUES (89, 7, 29, '2025-08-10 15:25:32.376');
INSERT INTO "public"."RolePermission" VALUES (90, 7, 54, '2025-08-10 15:25:32.506');
INSERT INTO "public"."RolePermission" VALUES (91, 7, 55, '2025-08-10 15:25:32.635');
INSERT INTO "public"."RolePermission" VALUES (92, 7, 56, '2025-08-10 15:25:32.764');
INSERT INTO "public"."RolePermission" VALUES (93, 7, 57, '2025-08-10 15:25:32.893');
INSERT INTO "public"."RolePermission" VALUES (94, 7, 59, '2025-08-10 15:25:33.023');
INSERT INTO "public"."RolePermission" VALUES (95, 8, 29, '2025-08-10 15:25:33.231');
INSERT INTO "public"."RolePermission" VALUES (96, 8, 30, '2025-08-10 15:25:33.36');
INSERT INTO "public"."RolePermission" VALUES (97, 8, 31, '2025-08-10 15:25:33.489');
INSERT INTO "public"."RolePermission" VALUES (98, 8, 32, '2025-08-10 15:25:33.619');
INSERT INTO "public"."RolePermission" VALUES (99, 8, 33, '2025-08-10 15:25:33.749');
INSERT INTO "public"."RolePermission" VALUES (100, 8, 34, '2025-08-10 15:25:33.878');
INSERT INTO "public"."RolePermission" VALUES (101, 8, 35, '2025-08-10 15:25:34.007');
INSERT INTO "public"."RolePermission" VALUES (102, 8, 36, '2025-08-10 15:25:34.138');
INSERT INTO "public"."RolePermission" VALUES (103, 8, 37, '2025-08-10 15:25:34.27');
INSERT INTO "public"."RolePermission" VALUES (104, 8, 38, '2025-08-10 15:25:34.63');
INSERT INTO "public"."RolePermission" VALUES (105, 8, 39, '2025-08-10 15:25:34.759');
INSERT INTO "public"."RolePermission" VALUES (106, 8, 40, '2025-08-10 15:25:34.888');
INSERT INTO "public"."RolePermission" VALUES (107, 9, 29, '2025-08-10 15:25:35.098');
INSERT INTO "public"."RolePermission" VALUES (108, 9, 41, '2025-08-10 15:25:35.228');
INSERT INTO "public"."RolePermission" VALUES (109, 9, 42, '2025-08-10 15:25:35.357');
INSERT INTO "public"."RolePermission" VALUES (110, 9, 43, '2025-08-10 15:25:35.486');
INSERT INTO "public"."RolePermission" VALUES (111, 9, 44, '2025-08-10 15:25:35.616');
INSERT INTO "public"."RolePermission" VALUES (112, 9, 45, '2025-08-10 15:25:35.745');
INSERT INTO "public"."RolePermission" VALUES (113, 9, 46, '2025-08-10 15:25:35.874');
INSERT INTO "public"."RolePermission" VALUES (114, 10, 29, '2025-08-10 15:25:36.082');
INSERT INTO "public"."RolePermission" VALUES (115, 10, 47, '2025-08-10 15:25:36.211');
INSERT INTO "public"."RolePermission" VALUES (116, 10, 48, '2025-08-10 15:25:36.346');
INSERT INTO "public"."RolePermission" VALUES (117, 10, 49, '2025-08-10 15:25:36.476');
INSERT INTO "public"."RolePermission" VALUES (118, 10, 50, '2025-08-10 15:25:36.606');
INSERT INTO "public"."RolePermission" VALUES (119, 11, 29, '2025-08-10 15:25:36.813');
INSERT INTO "public"."RolePermission" VALUES (120, 11, 51, '2025-08-10 15:25:36.943');
INSERT INTO "public"."RolePermission" VALUES (121, 11, 52, '2025-08-10 15:25:37.072');
INSERT INTO "public"."RolePermission" VALUES (122, 11, 53, '2025-08-10 15:25:37.202');
INSERT INTO "public"."RolePermission" VALUES (123, 12, 29, '2025-08-10 15:25:37.385');
INSERT INTO "public"."RolePermission" VALUES (124, 12, 37, '2025-08-10 15:25:37.515');
INSERT INTO "public"."RolePermission" VALUES (125, 12, 50, '2025-08-10 15:25:37.644');
INSERT INTO "public"."RolePermission" VALUES (126, 12, 54, '2025-08-10 15:25:37.774');
INSERT INTO "public"."RolePermission" VALUES (127, 12, 58, '2025-08-10 15:25:37.903');

-- ----------------------------
-- Table structure for SystemNotification
-- ----------------------------
DROP TABLE IF EXISTS "public"."SystemNotification";
CREATE TABLE "public"."SystemNotification" (
  "id" int4 NOT NULL DEFAULT nextval('"SystemNotification_id_seq"'::regclass),
  "title" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "isRead" bool NOT NULL DEFAULT false,
  "userId" int4,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of SystemNotification
-- ----------------------------

-- ----------------------------
-- Table structure for Task
-- ----------------------------
DROP TABLE IF EXISTS "public"."Task";
CREATE TABLE "public"."Task" (
  "id" int4 NOT NULL DEFAULT nextval('"Task_id_seq"'::regclass),
  "authorId" int4 NOT NULL,
  "categoryId" int4 NOT NULL,
  "title" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" "public"."TaskStatus" NOT NULL DEFAULT 'PENDING'::"TaskStatus",
  "points" int4 NOT NULL,
  "isTop" bool NOT NULL DEFAULT false,
  "isDeleted" bool NOT NULL DEFAULT false,
  "isHidden" bool NOT NULL DEFAULT false,
  "viewCount" int4 NOT NULL DEFAULT 0,
  "attachments" jsonb,
  "rejectReason" text COLLATE "pg_catalog"."default",
  "completedAt" timestamp(3),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "noNeedMeConfirmed" bool NOT NULL DEFAULT true
)
;

-- ----------------------------
-- Records of Task
-- ----------------------------
INSERT INTO "public"."Task" VALUES (1, 1, 1, '防守打法撒法撒旦法', '范德萨发发发范德萨发水岸东方士大夫', 'APPROVED', 100, 'f', 'f', 'f', 57, '[]', NULL, NULL, '2025-07-27 09:56:07.777', '2025-08-04 13:27:34.817', 'f');
INSERT INTO "public"."Task" VALUES (2, 5, 1, '版本', '法撒旦 奥德赛sad发', 'PENDING', 100, 'f', 't', 'f', 0, '[]', NULL, NULL, '2025-07-28 14:31:39.598', '2025-07-28 14:53:21.757', 'f');
INSERT INTO "public"."Task" VALUES (5, 1, 1, '测试任务', '<p>对对对</p>', 'REJECTED', 100, 'f', 't', 't', 4, '[]', '发撒的发撒的发士大夫水岸东方水岸东方士大夫水岸东方士大夫', '2025-08-22 23:06:00', '2025-08-04 13:26:19.008', '2025-08-14 09:43:57.438', 'f');
INSERT INTO "public"."Task" VALUES (7, 1, 2, '包体2', '<p>包体2包体2包体2包体2<img src="https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/14/ee7a4612-3a3a-453f-8b8b-f8d9243b2d8a.jpeg" alt="" data-href="" width="" height="" style="width: 350.00px;height: 350.00px;"/></p><p><br></p><p>发撒的发生发生发生方艾师傅</p>', 'PENDING', 55, 'f', 't', 'f', 25, '[{"url": "https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/14/88229789-aa8f-4888-bf09-19c651b1a4a6.jpeg", "name": "7b1ddde7-123a-4a39-bea4-f27f6cf351a6 (1).jpeg"}]', NULL, NULL, '2025-08-14 08:01:01.438', '2025-08-14 09:40:04.572', 'f');
INSERT INTO "public"."Task" VALUES (4, 1, 1, '任务测试', '<p>任务测试任务测试任务测试<img src="https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/03/e80e513f-6319-4489-8a5e-ea7a796ed742.png" alt="" data-href="" width="" height="" style=""/></p>', 'ADMIN_CONFIRMED', 100, 'f', 'f', 'f', 32, '[]', NULL, NULL, '2025-08-03 13:52:34.328', '2025-08-14 16:23:44.05', 'f');
INSERT INTO "public"."Task" VALUES (6, 6, 3, '标题1', '<p>标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1</p>', 'COMPLETED', 1003, 't', 'f', 'f', 12, '["https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/videos/2025/08/14/ec4ecd4e-6ce8-4f1d-aa34-c2bfc37dccf3.mp4"]', '范德萨发发士大夫', NULL, '2025-08-13 10:46:01.195', '2025-08-14 16:25:48.946', 'f');
INSERT INTO "public"."Task" VALUES (3, 1, 2, '范德萨发', '<p><br></p><p><br></p><table style="width: auto; table-layout: fixed; height: 0px; border-width: 0px;"><colgroup contenteditable="false"><col width="NaN"></colgroup><tbody><tr><td colspan="1" rowspan="1" width="auto" style="border-width: 0px; border-style: solid; border-color: rgb(204, 204, 204);"><p>最近开始正式挖洞了，也是选择从相对来说比较简单的edusrc开始挖，后续准备挖公益然后企业等。都说信息收集决定了挖洞的下限。所以说信息收集相对来说是非常重要的，接下来我想分享一下我对edu信息收集的一些理解，edu和企业src那些收集思路还是有差别的。<br><br>[C] <span style="font-size: 12px;"><em>纯文本查看</em></span> <span style="font-size: 12px;"><em>复制代码<br><br><br></em></span>?</p></td></tr></tbody></table><table style="width: auto; table-layout: fixed; height: 0px; border-width: 0px;"><colgroup contenteditable="false"><col width="40"><col width="NaN"></colgroup><tbody><tr><td colspan="1" rowspan="1" width="auto" style="border-width: 0px; border-style: solid; border-color: rgb(204, 204, 204);"><p>1</p><p>2</p><p>3</p></td><td colspan="1" rowspan="1" width="auto" style="border-width: 0px; border-style: solid; border-color: rgb(204, 204, 204);"><p>edusrc地址:[url]https://src.sjtu.edu.cn/[/url]刚开始大家可能没有账号，获得账号有两个方式。第一个是提交一个有效的漏洞，通过后就可以获得账号了。第二个是填写邀请码，一般社区会不定时发放。//我也是这种方式进的<br><img src="https://bbs.ichunqiu.com/data/attachment/forum/202311/17/020452oslwfvi4gzfnsgyn.png.thumb.jpg" alt="" data-href="" width="" height="" style=""></p></td></tr></tbody></table><p><br></p>', 'PUBLISHER_CONFIRMED', 12520, 'f', 'f', 'f', 30, '["https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/03/268607fa-a0f1-41b6-af64-e09abc2c1358.png", "https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/03/fc74a1f8-d587-4dd7-ad10-7b4da2495e5a.png"]', '辅导费地方亲亲，辛苦您稍等，小二马上去查看一下。发斯蒂芬艾师傅艾师傅艾师傅', '2025-08-29 18:08:24', '2025-07-29 14:08:55.824', '2025-08-14 12:14:37.353', 'f');

-- ----------------------------
-- Table structure for TaskApplication
-- ----------------------------
DROP TABLE IF EXISTS "public"."TaskApplication";
CREATE TABLE "public"."TaskApplication" (
  "id" int4 NOT NULL DEFAULT nextval('"TaskApplication_id_seq"'::regclass),
  "applicantId" int4 NOT NULL,
  "taskId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reason" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of TaskApplication
-- ----------------------------
INSERT INTO "public"."TaskApplication" VALUES (1, 5, 1, '2025-07-27 10:48:05.733', NULL);
INSERT INTO "public"."TaskApplication" VALUES (2, 5, 4, '2025-08-04 13:28:39.854', NULL);
INSERT INTO "public"."TaskApplication" VALUES (3, 6, 4, '2025-08-13 19:35:47.234', 'fdsafadsf');
INSERT INTO "public"."TaskApplication" VALUES (4, 1, 6, '2025-08-14 07:20:26.399', '5555');
INSERT INTO "public"."TaskApplication" VALUES (5, 6, 3, '2025-08-14 10:00:11.534', 'FSADFASDFASFDASD');

-- ----------------------------
-- Table structure for TaskAssignment
-- ----------------------------
DROP TABLE IF EXISTS "public"."TaskAssignment";
CREATE TABLE "public"."TaskAssignment" (
  "id" int4 NOT NULL DEFAULT nextval('"TaskAssignment_id_seq"'::regclass),
  "taskId" int4 NOT NULL,
  "assigneeId" int4 NOT NULL,
  "assignedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "proof" text COLLATE "pg_catalog"."default",
  "fileUrls" jsonb,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of TaskAssignment
-- ----------------------------
INSERT INTO "public"."TaskAssignment" VALUES (1, 4, 6, '2025-08-13 19:42:41.258', NULL, NULL, '2025-08-13 19:42:41.259', '2025-08-13 19:42:41.259');
INSERT INTO "public"."TaskAssignment" VALUES (2, 3, 6, '2025-08-14 10:00:44.531', 'gfdsgdsfsdafsadf', '[{"url": "https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/14/7af01901-0cda-4674-aefe-92c8262fc77d.octet-stream", "name": "localhost-body-1755046532.pen"}]', '2025-08-14 10:00:44.533', '2025-08-14 10:29:08.812');

-- ----------------------------
-- Table structure for TaskCategory
-- ----------------------------
DROP TABLE IF EXISTS "public"."TaskCategory";
CREATE TABLE "public"."TaskCategory" (
  "id" int4 NOT NULL DEFAULT nextval('"TaskCategory_id_seq"'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "imageUrl" varchar(500) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "sort" int4 NOT NULL DEFAULT 0
)
;

-- ----------------------------
-- Records of TaskCategory
-- ----------------------------
INSERT INTO "public"."TaskCategory" VALUES (1, '发达', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/27/ac52aa1e-ef7f-49c3-9811-6f37a216dbc2.png', '范德萨', '2025-07-27 09:24:36.033', '2025-07-27 09:24:36.033', 0);
INSERT INTO "public"."TaskCategory" VALUES (2, '任务分类2', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/28/dc167ae3-1585-4499-ae8d-1b0b480f1985.png', '分割', '2025-07-28 15:53:01.244', '2025-07-28 15:53:01.244', 0);
INSERT INTO "public"."TaskCategory" VALUES (3, '任务分类23', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/28/49134776-0989-4d3f-8057-d971b13b3e9a.jpeg', '任务分类23', '2025-07-28 15:53:13.546', '2025-07-28 15:53:13.546', 0);
INSERT INTO "public"."TaskCategory" VALUES (4, '任务分类4', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/28/312d498a-4e4d-484e-8477-968580817f5b.png', '任务分类4', '2025-07-28 15:53:36.726', '2025-07-28 15:53:36.726', 0);

-- ----------------------------
-- Table structure for TaskComment
-- ----------------------------
DROP TABLE IF EXISTS "public"."TaskComment";
CREATE TABLE "public"."TaskComment" (
  "id" int4 NOT NULL DEFAULT nextval('"TaskComment_id_seq"'::regclass),
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "authorId" int4 NOT NULL,
  "taskId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "dislikeCount" int4 NOT NULL DEFAULT 0,
  "likeCount" int4 NOT NULL DEFAULT 0,
  "parentId" int4,
  "pics" varchar(500)[] COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of TaskComment
-- ----------------------------
INSERT INTO "public"."TaskComment" VALUES (1, '555', 5, 1, '2025-07-27 11:26:33.888', '2025-07-27 11:26:33.888', 0, 0, NULL, NULL);
INSERT INTO "public"."TaskComment" VALUES (2, 'sdafasdf', 5, 1, '2025-07-27 14:41:16.007', '2025-07-27 14:41:16.007', 0, 0, NULL, '{}');
INSERT INTO "public"."TaskComment" VALUES (3, 'fsadfas', 5, 1, '2025-07-27 14:41:23.147', '2025-07-27 14:41:23.147', 0, 0, NULL, '{https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/07/27/183e4558-7fe9-4358-b93d-9a544160d2d0.png?q-sign-algorithm=sha1&q-ak=AKIDnrlXAdy99ya3LTPCnCNL4cx40kJix10t&q-sign-time=1753627280;1753634480&q-key-time=1753627280;1753634480&q-header-list=host&q-url-param-list=&q-signature=e4e8fc5f0a1fe885523a93da4d85a149bec9b0fd}');
INSERT INTO "public"."TaskComment" VALUES (4, '范德萨发', 5, 1, '2025-07-27 14:54:31.438', '2025-07-27 14:54:31.438', 0, 0, NULL, '{}');
INSERT INTO "public"."TaskComment" VALUES (5, '范德萨发啊范德萨', 5, 1, '2025-07-27 14:54:37.581', '2025-07-27 14:54:37.581', 0, 0, 4, '{}');
INSERT INTO "public"."TaskComment" VALUES (6, '范德萨发', 1, 1, '2025-07-30 15:31:20.531', '2025-07-30 15:31:20.531', 0, 0, NULL, '{}');
INSERT INTO "public"."TaskComment" VALUES (7, '111', 1, 1, '2025-07-30 15:31:59.36', '2025-07-30 15:31:59.36', 0, 0, NULL, '{}');
INSERT INTO "public"."TaskComment" VALUES (8, '22', 1, 1, '2025-07-30 15:32:02.376', '2025-07-30 15:32:02.376', 0, 0, NULL, '{}');
INSERT INTO "public"."TaskComment" VALUES (9, '333', 1, 1, '2025-07-30 15:32:04.69', '2025-07-30 15:32:04.69', 0, 0, NULL, '{}');
INSERT INTO "public"."TaskComment" VALUES (10, '444', 1, 1, '2025-07-30 15:32:07.175', '2025-07-30 15:32:07.175', 0, 0, NULL, '{}');
INSERT INTO "public"."TaskComment" VALUES (11, '555', 1, 1, '2025-07-30 15:32:12.012', '2025-07-30 15:32:12.012', 0, 0, NULL, '{}');
INSERT INTO "public"."TaskComment" VALUES (12, '23', 1, 1, '2025-07-30 15:32:14.51', '2025-07-30 15:32:14.51', 0, 0, NULL, '{}');
INSERT INTO "public"."TaskComment" VALUES (13, '53', 1, 1, '2025-07-30 15:32:17.243', '2025-07-30 15:32:17.243', 0, 0, NULL, '{}');

-- ----------------------------
-- Table structure for TaskCommentLike
-- ----------------------------
DROP TABLE IF EXISTS "public"."TaskCommentLike";
CREATE TABLE "public"."TaskCommentLike" (
  "id" int4 NOT NULL DEFAULT nextval('"TaskCommentLike_id_seq"'::regclass),
  "commentId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of TaskCommentLike
-- ----------------------------
INSERT INTO "public"."TaskCommentLike" VALUES (1, 3, 5, '2025-07-27 14:46:25.179');
INSERT INTO "public"."TaskCommentLike" VALUES (2, 2, 5, '2025-07-27 14:51:32.316');

-- ----------------------------
-- Table structure for TaskFavorite
-- ----------------------------
DROP TABLE IF EXISTS "public"."TaskFavorite";
CREATE TABLE "public"."TaskFavorite" (
  "id" int4 NOT NULL DEFAULT nextval('"TaskFavorite_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "taskId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of TaskFavorite
-- ----------------------------
INSERT INTO "public"."TaskFavorite" VALUES (1, 5, 1, '2025-07-27 15:00:36.074');
INSERT INTO "public"."TaskFavorite" VALUES (2, 1, 1, '2025-08-01 18:06:20.314');
INSERT INTO "public"."TaskFavorite" VALUES (3, 5, 4, '2025-08-04 13:29:10.538');

-- ----------------------------
-- Table structure for TaskLike
-- ----------------------------
DROP TABLE IF EXISTS "public"."TaskLike";
CREATE TABLE "public"."TaskLike" (
  "id" int4 NOT NULL DEFAULT nextval('"TaskLike_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "taskId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of TaskLike
-- ----------------------------
INSERT INTO "public"."TaskLike" VALUES (1, 5, 1, '2025-07-27 15:00:34.164');
INSERT INTO "public"."TaskLike" VALUES (2, 5, 4, '2025-08-04 13:29:09.863');

-- ----------------------------
-- Table structure for User
-- ----------------------------
DROP TABLE IF EXISTS "public"."User";
CREATE TABLE "public"."User" (
  "id" int4 NOT NULL DEFAULT nextval('"User_id_seq"'::regclass),
  "nickname" text COLLATE "pg_catalog"."default" NOT NULL,
  "phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default",
  "avatar" text COLLATE "pg_catalog"."default" DEFAULT '/default-avatar.png'::text,
  "role" "public"."UserRole" NOT NULL DEFAULT 'USER'::"UserRole",
  "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE'::"UserStatus",
  "loginCount" int4 NOT NULL DEFAULT 0,
  "lastLoginIp" text COLLATE "pg_catalog"."default",
  "bio" text COLLATE "pg_catalog"."default",
  "wechat" text COLLATE "pg_catalog"."default",
  "qq" text COLLATE "pg_catalog"."default",
  "points" int4 NOT NULL DEFAULT 0,
  "studyTime" int4 NOT NULL DEFAULT 0,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL,
  "lastLoginAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "courseCount" int4 NOT NULL DEFAULT 0
)
;

-- ----------------------------
-- Records of User
-- ----------------------------
INSERT INTO "public"."User" VALUES (12, 'hhh', '15755442358', '$argon2id$v=19$m=65536,t=3,p=4$FqjnxnhPD6uFtqGpX9VKbA$RkEHzuEake5CnojvTcXXNxLtLCRX1gVrV78n22NGSuc', 'admi23n@qq.com', '/default-avatar.png', 'USER', 'ACTIVE', 0, NULL, NULL, NULL, NULL, 594, 0, '2025-08-02 02:17:10.183', '2025-08-10 09:34:39.117', '2025-08-02 02:17:10.183', 0);
INSERT INTO "public"."User" VALUES (5, '测试用户23', '19296393616', '$argon2id$v=19$m=65536,t=3,p=4$mO6KR9Sfq7FvwcJdMXKfOA$4Scyd+GwwEtobiFhT1C359hXY04obisAdqN3UwCE6X0', NULL, '/default-avatar.png', 'USER', 'ACTIVE', 7, '::1', NULL, NULL, NULL, 554299, 0, '2025-07-21 15:40:56.498', '2025-08-13 08:07:48.849', '2025-08-13 08:07:21.566', 0);
INSERT INTO "public"."User" VALUES (2, '测试用户13', '14215571240', '$argon2id$v=19$m=65536,t=3,p=4$S787qUxC2lhkz043zT2v1Q$bEl98ScRqxJ5D/ncmiQdJ7haQ/Pj2WWRTC1amu7L0qY', NULL, '/default-avatar.png', 'USER', 'INACTIVE', 6, '::1', NULL, NULL, NULL, 0, 0, '2025-07-21 15:26:58.15', '2025-08-04 13:43:31.136', '2025-08-03 11:07:31.411', 0);
INSERT INTO "public"."User" VALUES (15, 'ttt', '15669041216', '$argon2id$v=19$m=65536,t=3,p=4$bMjkWkO6D9TxKwdQvspCaA$tR+/Kh3xT3OuY+dSnayDuZU6oN407uQ0su5GBBvkUmo', 'admin23@qq2.com', '/default-avatar.png', 'ADMIN', 'ACTIVE', 0, NULL, NULL, NULL, NULL, 0, 0, '2025-08-10 13:01:57.989', '2025-08-10 13:28:43.129', '2025-08-10 13:01:57.989', 0);
INSERT INTO "public"."User" VALUES (7, 'admin1', '', '$argon2id$v=19$m=65536,t=3,p=4$xtaja8iqEY66xyaTv1PUWQ$uCt28NI56vUFithkRbKLQtEf5ia8gc2EehlHzJ2xh8M', 'admin@qq.com', '/default-avatar.png', 'SUPER_ADMIN', 'ACTIVE', 0, NULL, NULL, NULL, NULL, 0, 0, '2025-07-30 13:11:07.78', '2025-07-30 13:11:07.78', '2025-07-30 13:11:07.78', 0);
INSERT INTO "public"."User" VALUES (6, '测试用户33', '17241296983', '$argon2id$v=19$m=65536,t=3,p=4$vFbkk59I+IDcC3rRLTn9Vw$bUvDYqAMPll7EdEQGmtTINOrNmiohV+f/jz7ZhPA7vU', NULL, '/default-avatar.png', 'USER', 'ACTIVE', 12, '::1', NULL, NULL, NULL, 2253634, 0, '2025-07-22 13:11:12.344', '2025-08-14 09:51:20.493', '2025-08-14 09:51:20.491', 0);
INSERT INTO "public"."User" VALUES (1, 'admin', '15755442378', '$argon2id$v=19$m=65536,t=3,p=4$QQFOiSEO9IkvSJ49PL/9kA$Zs4l9yMPUdBuFSOsJ13rgch2pV27UMF0NvSEYwx+FzQ', 'admin@example.com', 'https://study-platform-1258739349.cos.ap-guangzhou.myqcloud.com/uploads/images/2025/08/03/0cd76aab-5302-4d78-8c6e-e8cb1d09d588.jpeg', 'SUPER_ADMIN', 'ACTIVE', 58, '::1', '割发代首割发代首方阿斯蒂芬大', NULL, NULL, 17271, 0, '2025-07-18 00:00:00', '2025-08-14 15:45:35.727', '2025-08-14 15:45:35.725', 0);
INSERT INTO "public"."User" VALUES (16, 'wzq', '15669041256', '$argon2id$v=19$m=65536,t=3,p=4$KEK8Vop675q5t+CQi5Oz6Q$3Ex6t4016ybFcwmfRFKp23c7bZMLtoiHYXkSridAuek', 'wzqwzqwzq@qq.com', '/default-avatar.png', 'ADMIN', 'ACTIVE', 3, NULL, NULL, NULL, NULL, 0, 0, '2025-08-10 15:26:49.875', '2025-08-13 07:40:45.832', '2025-08-10 15:39:12.169', 0);

-- ----------------------------
-- Table structure for UserMessage
-- ----------------------------
DROP TABLE IF EXISTS "public"."UserMessage";
CREATE TABLE "public"."UserMessage" (
  "id" int4 NOT NULL DEFAULT nextval('"UserMessage_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of UserMessage
-- ----------------------------

-- ----------------------------
-- Table structure for UserRoleRelation
-- ----------------------------
DROP TABLE IF EXISTS "public"."UserRoleRelation";
CREATE TABLE "public"."UserRoleRelation" (
  "id" int4 NOT NULL DEFAULT nextval('"UserRoleRelation_id_seq"'::regclass),
  "userId" int4 NOT NULL,
  "roleId" int4 NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of UserRoleRelation
-- ----------------------------
INSERT INTO "public"."UserRoleRelation" VALUES (5, 15, 10, '2025-08-10 15:26:03.378');
INSERT INTO "public"."UserRoleRelation" VALUES (7, 16, 9, '2025-08-10 15:39:00.94');
INSERT INTO "public"."UserRoleRelation" VALUES (8, 16, 10, '2025-08-10 15:39:00.94');

-- ----------------------------
-- Table structure for VerificationCode
-- ----------------------------
DROP TABLE IF EXISTS "public"."VerificationCode";
CREATE TABLE "public"."VerificationCode" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "phone" text COLLATE "pg_catalog"."default" NOT NULL,
  "code" text COLLATE "pg_catalog"."default" NOT NULL,
  "expiresAt" timestamp(3) NOT NULL,
  "type" text COLLATE "pg_catalog"."default" NOT NULL,
  "isUsed" bool NOT NULL DEFAULT false,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of VerificationCode
-- ----------------------------
INSERT INTO "public"."VerificationCode" VALUES ('cmdx5i0000002uq5waz700gqt', '15755442378', '666666', '2025-08-04 13:43:22.175', 'reset_password', 't', '2025-08-04 13:33:22.176', '2025-08-04 13:33:36.45');
INSERT INTO "public"."VerificationCode" VALUES ('cme9nuv8a000uuq44rbiv74h1', '15669041256', '666666', '2025-08-13 07:50:29.693', 'reset_password', 't', '2025-08-13 07:40:29.695', '2025-08-13 07:40:45.892');

-- ----------------------------
-- Table structure for WithdrawRecord
-- ----------------------------
DROP TABLE IF EXISTS "public"."WithdrawRecord";
CREATE TABLE "public"."WithdrawRecord" (
  "id" int4 NOT NULL DEFAULT nextval('"WithdrawRecord_id_seq"'::regclass),
  "taskId" int4 NOT NULL,
  "userId" int4 NOT NULL,
  "amount" float8 NOT NULL,
  "actualAmount" float8 NOT NULL,
  "fee" float8 NOT NULL,
  "accountType" text COLLATE "pg_catalog"."default" NOT NULL,
  "accountInfo" jsonb NOT NULL,
  "status" text COLLATE "pg_catalog"."default" NOT NULL,
  "alipayOrderId" text COLLATE "pg_catalog"."default",
  "alipayResponse" jsonb,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL
)
;

-- ----------------------------
-- Records of WithdrawRecord
-- ----------------------------
INSERT INTO "public"."WithdrawRecord" VALUES (1, 3, 6, 12520, 11268, 1252, 'alipay', '{"account": "ypwuvr9165@sandbox.com", "realName": "ypwuvr9165"}', 'PROCESSING', '1755179017536', '{}', '2025-08-14 13:43:37.537', '2025-08-14 13:43:37.538');

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ArticleCategory_id_seq"
OWNED BY "public"."ArticleCategory"."id";
SELECT setval('"public"."ArticleCategory_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ArticleCommentLike_id_seq"
OWNED BY "public"."ArticleCommentLike"."id";
SELECT setval('"public"."ArticleCommentLike_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ArticleComment_id_seq"
OWNED BY "public"."ArticleComment"."id";
SELECT setval('"public"."ArticleComment_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Article_id_seq"
OWNED BY "public"."Article"."id";
SELECT setval('"public"."Article_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ConfigImageValue_id_seq"
OWNED BY "public"."ConfigImageValue"."id";
SELECT setval('"public"."ConfigImageValue_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ConfigMultiContentValue_id_seq"
OWNED BY "public"."ConfigMultiContentValue"."id";
SELECT setval('"public"."ConfigMultiContentValue_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ConfigMultiImageValue_id_seq"
OWNED BY "public"."ConfigMultiImageValue"."id";
SELECT setval('"public"."ConfigMultiImageValue_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ConfigMultiTextValue_id_seq"
OWNED BY "public"."ConfigMultiTextValue"."id";
SELECT setval('"public"."ConfigMultiTextValue_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ConfigTextValue_id_seq"
OWNED BY "public"."ConfigTextValue"."id";
SELECT setval('"public"."ConfigTextValue_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Config_id_seq"
OWNED BY "public"."Config"."id";
SELECT setval('"public"."Config_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."CourseCategory_id_seq"
OWNED BY "public"."CourseCategory"."id";
SELECT setval('"public"."CourseCategory_id_seq"', 16, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."CourseChapterLog_id_seq"
OWNED BY "public"."CourseChapterLog"."id";
SELECT setval('"public"."CourseChapterLog_id_seq"', 683, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."CourseChapter_id_seq"
OWNED BY "public"."CourseChapter"."id";
SELECT setval('"public"."CourseChapter_id_seq"', 57, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."CourseCommentLike_id_seq"
OWNED BY "public"."CourseCommentLike"."id";
SELECT setval('"public"."CourseCommentLike_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."CourseComment_id_seq"
OWNED BY "public"."CourseComment"."id";
SELECT setval('"public"."CourseComment_id_seq"', 37, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."CourseDirection_id_seq"
OWNED BY "public"."CourseDirection"."id";
SELECT setval('"public"."CourseDirection_id_seq"', 12, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."CourseFavorite_id_seq"
OWNED BY "public"."CourseFavorite"."id";
SELECT setval('"public"."CourseFavorite_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."CourseLike_id_seq"
OWNED BY "public"."CourseLike"."id";
SELECT setval('"public"."CourseLike_id_seq"', 9, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."CourseRating_id_seq"
OWNED BY "public"."CourseRating"."id";
SELECT setval('"public"."CourseRating_id_seq"', 6, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Course_id_seq"
OWNED BY "public"."Course"."id";
SELECT setval('"public"."Course_id_seq"', 34, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumCategory_id_seq"
OWNED BY "public"."ForumCategory"."id";
SELECT setval('"public"."ForumCategory_id_seq"', 6, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumCommentDislike_id_seq"
OWNED BY "public"."ForumCommentDislike"."id";
SELECT setval('"public"."ForumCommentDislike_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumCommentLike_id_seq"
OWNED BY "public"."ForumCommentLike"."id";
SELECT setval('"public"."ForumCommentLike_id_seq"', 7, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumCommentReport_id_seq"
OWNED BY "public"."ForumCommentReport"."id";
SELECT setval('"public"."ForumCommentReport_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumComment_id_seq"
OWNED BY "public"."ForumComment"."id";
SELECT setval('"public"."ForumComment_id_seq"', 29, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumPostFavorite_id_seq"
OWNED BY "public"."ForumPostFavorite"."id";
SELECT setval('"public"."ForumPostFavorite_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumPostLike_id_seq"
OWNED BY "public"."ForumPostLike"."id";
SELECT setval('"public"."ForumPostLike_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumPostReport_id_seq"
OWNED BY "public"."ForumPostReport"."id";
SELECT setval('"public"."ForumPostReport_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumPost_id_seq"
OWNED BY "public"."ForumPost"."id";
SELECT setval('"public"."ForumPost_id_seq"', 11, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumSectionFavorite_id_seq"
OWNED BY "public"."ForumSectionFavorite"."id";
SELECT setval('"public"."ForumSectionFavorite_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."ForumSection_id_seq"
OWNED BY "public"."ForumSection"."id";
SELECT setval('"public"."ForumSection_id_seq"', 11, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."GameRegistration_id_seq"
OWNED BY "public"."GameRegistration"."id";
SELECT setval('"public"."GameRegistration_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Game_id_seq"
OWNED BY "public"."Game"."id";
SELECT setval('"public"."Game_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Permission_id_seq"
OWNED BY "public"."Permission"."id";
SELECT setval('"public"."Permission_id_seq"', 60, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."RegisterOrder_id_seq"
OWNED BY "public"."RegisterOrder"."id";
SELECT setval('"public"."RegisterOrder_id_seq"', 25, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."RolePermission_id_seq"
OWNED BY "public"."RolePermission"."id";
SELECT setval('"public"."RolePermission_id_seq"', 128, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Role_id_seq"
OWNED BY "public"."Role"."id";
SELECT setval('"public"."Role_id_seq"', 13, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."SystemNotification_id_seq"
OWNED BY "public"."SystemNotification"."id";
SELECT setval('"public"."SystemNotification_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."TaskApplication_id_seq"
OWNED BY "public"."TaskApplication"."id";
SELECT setval('"public"."TaskApplication_id_seq"', 6, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."TaskAssignment_id_seq"
OWNED BY "public"."TaskAssignment"."id";
SELECT setval('"public"."TaskAssignment_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."TaskCategory_id_seq"
OWNED BY "public"."TaskCategory"."id";
SELECT setval('"public"."TaskCategory_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."TaskCommentLike_id_seq"
OWNED BY "public"."TaskCommentLike"."id";
SELECT setval('"public"."TaskCommentLike_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."TaskComment_id_seq"
OWNED BY "public"."TaskComment"."id";
SELECT setval('"public"."TaskComment_id_seq"', 14, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."TaskFavorite_id_seq"
OWNED BY "public"."TaskFavorite"."id";
SELECT setval('"public"."TaskFavorite_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."TaskLike_id_seq"
OWNED BY "public"."TaskLike"."id";
SELECT setval('"public"."TaskLike_id_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Task_id_seq"
OWNED BY "public"."Task"."id";
SELECT setval('"public"."Task_id_seq"', 8, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."UserMessage_id_seq"
OWNED BY "public"."UserMessage"."id";
SELECT setval('"public"."UserMessage_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."UserRoleRelation_id_seq"
OWNED BY "public"."UserRoleRelation"."id";
SELECT setval('"public"."UserRoleRelation_id_seq"', 9, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."User_id_seq"
OWNED BY "public"."User"."id";
SELECT setval('"public"."User_id_seq"', 17, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."WithdrawRecord_id_seq"
OWNED BY "public"."WithdrawRecord"."id";
SELECT setval('"public"."WithdrawRecord_id_seq"', 2, true);

-- ----------------------------
-- Indexes structure for table Article
-- ----------------------------
CREATE INDEX "Article_authorId_idx" ON "public"."Article" USING btree (
  "authorId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Article_categoryId_idx" ON "public"."Article" USING btree (
  "categoryId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Article_createdAt_idx" ON "public"."Article" USING btree (
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "Article_status_idx" ON "public"."Article" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Article
-- ----------------------------
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ArticleCategory
-- ----------------------------
ALTER TABLE "public"."ArticleCategory" ADD CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ArticleComment
-- ----------------------------
ALTER TABLE "public"."ArticleComment" ADD CONSTRAINT "ArticleComment_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ArticleCommentLike
-- ----------------------------
CREATE UNIQUE INDEX "ArticleCommentLike_userId_commentId_key" ON "public"."ArticleCommentLike" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "commentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ArticleCommentLike
-- ----------------------------
ALTER TABLE "public"."ArticleCommentLike" ADD CONSTRAINT "ArticleCommentLike_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Config
-- ----------------------------
CREATE INDEX "Config_isEnabled_idx" ON "public"."Config" USING btree (
  "isEnabled" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "Config_key_key" ON "public"."Config" USING btree (
  "key" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "Config_sort_idx" ON "public"."Config" USING btree (
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Config_type_idx" ON "public"."Config" USING btree (
  "type" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Config
-- ----------------------------
ALTER TABLE "public"."Config" ADD CONSTRAINT "Config_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ConfigImageValue
-- ----------------------------
CREATE INDEX "ConfigImageValue_configId_idx" ON "public"."ConfigImageValue" USING btree (
  "configId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "ConfigImageValue_configId_key" ON "public"."ConfigImageValue" USING btree (
  "configId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ConfigImageValue
-- ----------------------------
ALTER TABLE "public"."ConfigImageValue" ADD CONSTRAINT "ConfigImageValue_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ConfigMultiContentValue
-- ----------------------------
CREATE INDEX "ConfigMultiContentValue_configId_sort_idx" ON "public"."ConfigMultiContentValue" USING btree (
  "configId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ConfigMultiContentValue
-- ----------------------------
ALTER TABLE "public"."ConfigMultiContentValue" ADD CONSTRAINT "ConfigMultiContentValue_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ConfigMultiImageValue
-- ----------------------------
CREATE INDEX "ConfigMultiImageValue_configId_sort_idx" ON "public"."ConfigMultiImageValue" USING btree (
  "configId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ConfigMultiImageValue
-- ----------------------------
ALTER TABLE "public"."ConfigMultiImageValue" ADD CONSTRAINT "ConfigMultiImageValue_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ConfigMultiTextValue
-- ----------------------------
CREATE INDEX "ConfigMultiTextValue_configId_sort_idx" ON "public"."ConfigMultiTextValue" USING btree (
  "configId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ConfigMultiTextValue
-- ----------------------------
ALTER TABLE "public"."ConfigMultiTextValue" ADD CONSTRAINT "ConfigMultiTextValue_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ConfigTextValue
-- ----------------------------
CREATE INDEX "ConfigTextValue_configId_idx" ON "public"."ConfigTextValue" USING btree (
  "configId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "ConfigTextValue_configId_key" ON "public"."ConfigTextValue" USING btree (
  "configId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ConfigTextValue
-- ----------------------------
ALTER TABLE "public"."ConfigTextValue" ADD CONSTRAINT "ConfigTextValue_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Course
-- ----------------------------
CREATE INDEX "Course_categoryId_idx" ON "public"."Course" USING btree (
  "categoryId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Course_directionId_idx" ON "public"."Course" USING btree (
  "directionId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Course_isDeleted_idx" ON "public"."Course" USING btree (
  "isDeleted" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "Course_isHidden_idx" ON "public"."Course" USING btree (
  "isHidden" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "Course_isTop_idx" ON "public"."Course" USING btree (
  "isTop" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "Course_level_idx" ON "public"."Course" USING btree (
  "level" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Course_status_idx" ON "public"."Course" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Course
-- ----------------------------
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table CourseCategory
-- ----------------------------
ALTER TABLE "public"."CourseCategory" ADD CONSTRAINT "CourseCategory_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table CourseChapter
-- ----------------------------
CREATE INDEX "CourseChapter_courseId_idx" ON "public"."CourseChapter" USING btree (
  "courseId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "CourseChapter_parentId_idx" ON "public"."CourseChapter" USING btree (
  "parentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "CourseChapter_sort_idx" ON "public"."CourseChapter" USING btree (
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "CourseChapter_uploaderId_idx" ON "public"."CourseChapter" USING btree (
  "uploaderId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table CourseChapter
-- ----------------------------
ALTER TABLE "public"."CourseChapter" ADD CONSTRAINT "CourseChapter_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table CourseChapterLog
-- ----------------------------
CREATE INDEX "CourseChapterLog_chapterId_idx" ON "public"."CourseChapterLog" USING btree (
  "chapterId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "CourseChapterLog_courseId_idx" ON "public"."CourseChapterLog" USING btree (
  "courseId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "CourseChapterLog_timestamp_idx" ON "public"."CourseChapterLog" USING btree (
  "timestamp" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "CourseChapterLog_userId_idx" ON "public"."CourseChapterLog" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table CourseChapterLog
-- ----------------------------
ALTER TABLE "public"."CourseChapterLog" ADD CONSTRAINT "CourseChapterLog_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table CourseComment
-- ----------------------------
CREATE INDEX "CourseComment_chapterId_idx" ON "public"."CourseComment" USING btree (
  "chapterId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "CourseComment_courseId_idx" ON "public"."CourseComment" USING btree (
  "courseId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "CourseComment_parentId_idx" ON "public"."CourseComment" USING btree (
  "parentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "CourseComment_userId_idx" ON "public"."CourseComment" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table CourseComment
-- ----------------------------
ALTER TABLE "public"."CourseComment" ADD CONSTRAINT "CourseComment_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table CourseCommentLike
-- ----------------------------
CREATE UNIQUE INDEX "CourseCommentLike_userId_commentId_key" ON "public"."CourseCommentLike" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "commentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table CourseCommentLike
-- ----------------------------
ALTER TABLE "public"."CourseCommentLike" ADD CONSTRAINT "CourseCommentLike_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table CourseDirection
-- ----------------------------
ALTER TABLE "public"."CourseDirection" ADD CONSTRAINT "CourseDirection_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table CourseFavorite
-- ----------------------------
CREATE INDEX "CourseFavorite_courseId_idx" ON "public"."CourseFavorite" USING btree (
  "courseId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "CourseFavorite_userId_courseId_key" ON "public"."CourseFavorite" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "courseId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table CourseFavorite
-- ----------------------------
ALTER TABLE "public"."CourseFavorite" ADD CONSTRAINT "CourseFavorite_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table CourseLike
-- ----------------------------
CREATE INDEX "CourseLike_courseId_idx" ON "public"."CourseLike" USING btree (
  "courseId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "CourseLike_userId_courseId_key" ON "public"."CourseLike" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "courseId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table CourseLike
-- ----------------------------
ALTER TABLE "public"."CourseLike" ADD CONSTRAINT "CourseLike_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table CourseOrder
-- ----------------------------
CREATE INDEX "CourseOrder_chapterId_idx" ON "public"."CourseOrder" USING btree (
  "chapterId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "CourseOrder_courseId_idx" ON "public"."CourseOrder" USING btree (
  "courseId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "CourseOrder_userId_idx" ON "public"."CourseOrder" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table CourseOrder
-- ----------------------------
ALTER TABLE "public"."CourseOrder" ADD CONSTRAINT "CourseOrder_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table CourseRating
-- ----------------------------
CREATE INDEX "CourseRating_courseId_idx" ON "public"."CourseRating" USING btree (
  "courseId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "CourseRating_userId_courseId_key" ON "public"."CourseRating" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "courseId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table CourseRating
-- ----------------------------
ALTER TABLE "public"."CourseRating" ADD CONSTRAINT "CourseRating_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumCategory
-- ----------------------------
CREATE INDEX "ForumCategory_name_idx" ON "public"."ForumCategory" USING btree (
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumCategory
-- ----------------------------
ALTER TABLE "public"."ForumCategory" ADD CONSTRAINT "ForumCategory_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumComment
-- ----------------------------
CREATE INDEX "ForumComment_authorId_idx" ON "public"."ForumComment" USING btree (
  "authorId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ForumComment_parentId_idx" ON "public"."ForumComment" USING btree (
  "parentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ForumComment_postId_idx" ON "public"."ForumComment" USING btree (
  "postId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumComment
-- ----------------------------
ALTER TABLE "public"."ForumComment" ADD CONSTRAINT "ForumComment_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumCommentDislike
-- ----------------------------
CREATE INDEX "ForumCommentDislike_commentId_idx" ON "public"."ForumCommentDislike" USING btree (
  "commentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "ForumCommentDislike_userId_commentId_key" ON "public"."ForumCommentDislike" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "commentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumCommentDislike
-- ----------------------------
ALTER TABLE "public"."ForumCommentDislike" ADD CONSTRAINT "ForumCommentDislike_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumCommentLike
-- ----------------------------
CREATE INDEX "ForumCommentLike_commentId_idx" ON "public"."ForumCommentLike" USING btree (
  "commentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "ForumCommentLike_userId_commentId_key" ON "public"."ForumCommentLike" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "commentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumCommentLike
-- ----------------------------
ALTER TABLE "public"."ForumCommentLike" ADD CONSTRAINT "ForumCommentLike_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumCommentReport
-- ----------------------------
CREATE INDEX "ForumCommentReport_commentId_idx" ON "public"."ForumCommentReport" USING btree (
  "commentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ForumCommentReport_userId_idx" ON "public"."ForumCommentReport" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumCommentReport
-- ----------------------------
ALTER TABLE "public"."ForumCommentReport" ADD CONSTRAINT "ForumCommentReport_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumPost
-- ----------------------------
CREATE INDEX "ForumPost_authorId_idx" ON "public"."ForumPost" USING btree (
  "authorId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ForumPost_createdAt_idx" ON "public"."ForumPost" USING btree (
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "ForumPost_isHot_idx" ON "public"."ForumPost" USING btree (
  "isHot" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "ForumPost_isTop_idx" ON "public"."ForumPost" USING btree (
  "isTop" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "ForumPost_sectionId_idx" ON "public"."ForumPost" USING btree (
  "sectionId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ForumPost_status_idx" ON "public"."ForumPost" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumPost
-- ----------------------------
ALTER TABLE "public"."ForumPost" ADD CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumPostFavorite
-- ----------------------------
CREATE INDEX "ForumPostFavorite_postId_idx" ON "public"."ForumPostFavorite" USING btree (
  "postId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "ForumPostFavorite_userId_postId_key" ON "public"."ForumPostFavorite" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "postId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumPostFavorite
-- ----------------------------
ALTER TABLE "public"."ForumPostFavorite" ADD CONSTRAINT "ForumPostFavorite_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumPostLike
-- ----------------------------
CREATE INDEX "ForumPostLike_postId_idx" ON "public"."ForumPostLike" USING btree (
  "postId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "ForumPostLike_userId_postId_key" ON "public"."ForumPostLike" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "postId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumPostLike
-- ----------------------------
ALTER TABLE "public"."ForumPostLike" ADD CONSTRAINT "ForumPostLike_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumPostReport
-- ----------------------------
CREATE INDEX "ForumPostReport_postId_idx" ON "public"."ForumPostReport" USING btree (
  "postId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ForumPostReport_userId_idx" ON "public"."ForumPostReport" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumPostReport
-- ----------------------------
ALTER TABLE "public"."ForumPostReport" ADD CONSTRAINT "ForumPostReport_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumSection
-- ----------------------------
CREATE INDEX "ForumSection_categoryId_idx" ON "public"."ForumSection" USING btree (
  "categoryId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ForumSection_moderatorId_idx" ON "public"."ForumSection" USING btree (
  "moderatorId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ForumSection_parentId_idx" ON "public"."ForumSection" USING btree (
  "parentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "ForumSection_sort_idx" ON "public"."ForumSection" USING btree (
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumSection
-- ----------------------------
ALTER TABLE "public"."ForumSection" ADD CONSTRAINT "ForumSection_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table ForumSectionFavorite
-- ----------------------------
CREATE INDEX "ForumSectionFavorite_sectionId_idx" ON "public"."ForumSectionFavorite" USING btree (
  "sectionId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "ForumSectionFavorite_userId_sectionId_key" ON "public"."ForumSectionFavorite" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "sectionId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table ForumSectionFavorite
-- ----------------------------
ALTER TABLE "public"."ForumSectionFavorite" ADD CONSTRAINT "ForumSectionFavorite_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Game
-- ----------------------------
CREATE INDEX "Game_createdAt_idx" ON "public"."Game" USING btree (
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "Game_status_idx" ON "public"."Game" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Game
-- ----------------------------
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table GameRegistration
-- ----------------------------
CREATE INDEX "GameRegistration_gameId_idx" ON "public"."GameRegistration" USING btree (
  "gameId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "GameRegistration_registeredAt_idx" ON "public"."GameRegistration" USING btree (
  "registeredAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "GameRegistration_status_idx" ON "public"."GameRegistration" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "GameRegistration_userId_gameId_key" ON "public"."GameRegistration" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "gameId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "GameRegistration_userId_idx" ON "public"."GameRegistration" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table GameRegistration
-- ----------------------------
ALTER TABLE "public"."GameRegistration" ADD CONSTRAINT "GameRegistration_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Order
-- ----------------------------
CREATE INDEX "Order_createdAt_idx" ON "public"."Order" USING btree (
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "Order_orderNo_idx" ON "public"."Order" USING btree (
  "orderNo" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "Order_orderNo_key" ON "public"."Order" USING btree (
  "orderNo" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "Order_status_idx" ON "public"."Order" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Order_type_idx" ON "public"."Order" USING btree (
  "type" "pg_catalog"."enum_ops" ASC NULLS LAST
);
CREATE INDEX "Order_userId_idx" ON "public"."Order" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Order
-- ----------------------------
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Permission
-- ----------------------------
CREATE INDEX "Permission_isEnabled_idx" ON "public"."Permission" USING btree (
  "isEnabled" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "Permission_name_idx" ON "public"."Permission" USING btree (
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "Permission_name_key" ON "public"."Permission" USING btree (
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "Permission_resource_idx" ON "public"."Permission" USING btree (
  "resource" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Permission
-- ----------------------------
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table RegisterOrder
-- ----------------------------
CREATE UNIQUE INDEX "RegisterOrder_orderNo_key" ON "public"."RegisterOrder" USING btree (
  "orderNo" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table RegisterOrder
-- ----------------------------
ALTER TABLE "public"."RegisterOrder" ADD CONSTRAINT "RegisterOrder_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Role
-- ----------------------------
CREATE INDEX "Role_isEnabled_idx" ON "public"."Role" USING btree (
  "isEnabled" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "Role_name_idx" ON "public"."Role" USING btree (
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role" USING btree (
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Role
-- ----------------------------
ALTER TABLE "public"."Role" ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table RolePermission
-- ----------------------------
CREATE INDEX "RolePermission_permissionId_idx" ON "public"."RolePermission" USING btree (
  "permissionId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "RolePermission_roleId_idx" ON "public"."RolePermission" USING btree (
  "roleId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "public"."RolePermission" USING btree (
  "roleId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "permissionId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table RolePermission
-- ----------------------------
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table SystemNotification
-- ----------------------------
CREATE INDEX "SystemNotification_createdAt_idx" ON "public"."SystemNotification" USING btree (
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "SystemNotification_isRead_idx" ON "public"."SystemNotification" USING btree (
  "isRead" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "SystemNotification_type_idx" ON "public"."SystemNotification" USING btree (
  "type" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "SystemNotification_userId_idx" ON "public"."SystemNotification" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table SystemNotification
-- ----------------------------
ALTER TABLE "public"."SystemNotification" ADD CONSTRAINT "SystemNotification_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table Task
-- ----------------------------
CREATE INDEX "Task_authorId_idx" ON "public"."Task" USING btree (
  "authorId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Task_categoryId_idx" ON "public"."Task" USING btree (
  "categoryId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Task_isDeleted_idx" ON "public"."Task" USING btree (
  "isDeleted" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "Task_isHidden_idx" ON "public"."Task" USING btree (
  "isHidden" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "Task_isTop_idx" ON "public"."Task" USING btree (
  "isTop" "pg_catalog"."bool_ops" ASC NULLS LAST
);
CREATE INDEX "Task_status_idx" ON "public"."Task" USING btree (
  "status" "pg_catalog"."enum_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table Task
-- ----------------------------
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table TaskApplication
-- ----------------------------
CREATE INDEX "TaskApplication_applicantId_idx" ON "public"."TaskApplication" USING btree (
  "applicantId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "TaskApplication_taskId_applicantId_key" ON "public"."TaskApplication" USING btree (
  "taskId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "applicantId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "TaskApplication_taskId_idx" ON "public"."TaskApplication" USING btree (
  "taskId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table TaskApplication
-- ----------------------------
ALTER TABLE "public"."TaskApplication" ADD CONSTRAINT "TaskApplication_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table TaskAssignment
-- ----------------------------
CREATE INDEX "TaskAssignment_assigneeId_idx" ON "public"."TaskAssignment" USING btree (
  "assigneeId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "TaskAssignment_taskId_key" ON "public"."TaskAssignment" USING btree (
  "taskId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table TaskAssignment
-- ----------------------------
ALTER TABLE "public"."TaskAssignment" ADD CONSTRAINT "TaskAssignment_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table TaskCategory
-- ----------------------------
CREATE INDEX "TaskCategory_name_idx" ON "public"."TaskCategory" USING btree (
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "TaskCategory_sort_idx" ON "public"."TaskCategory" USING btree (
  "sort" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table TaskCategory
-- ----------------------------
ALTER TABLE "public"."TaskCategory" ADD CONSTRAINT "TaskCategory_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table TaskComment
-- ----------------------------
CREATE INDEX "TaskComment_authorId_idx" ON "public"."TaskComment" USING btree (
  "authorId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "TaskComment_taskId_idx" ON "public"."TaskComment" USING btree (
  "taskId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table TaskComment
-- ----------------------------
ALTER TABLE "public"."TaskComment" ADD CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table TaskCommentLike
-- ----------------------------
CREATE INDEX "TaskCommentLike_commentId_idx" ON "public"."TaskCommentLike" USING btree (
  "commentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "TaskCommentLike_userId_commentId_key" ON "public"."TaskCommentLike" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "commentId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table TaskCommentLike
-- ----------------------------
ALTER TABLE "public"."TaskCommentLike" ADD CONSTRAINT "TaskCommentLike_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table TaskFavorite
-- ----------------------------
CREATE INDEX "TaskFavorite_taskId_idx" ON "public"."TaskFavorite" USING btree (
  "taskId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "TaskFavorite_userId_taskId_key" ON "public"."TaskFavorite" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "taskId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table TaskFavorite
-- ----------------------------
ALTER TABLE "public"."TaskFavorite" ADD CONSTRAINT "TaskFavorite_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table TaskLike
-- ----------------------------
CREATE INDEX "TaskLike_taskId_idx" ON "public"."TaskLike" USING btree (
  "taskId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "TaskLike_userId_taskId_key" ON "public"."TaskLike" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "taskId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table TaskLike
-- ----------------------------
ALTER TABLE "public"."TaskLike" ADD CONSTRAINT "TaskLike_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table User
-- ----------------------------
CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "User_nickname_key" ON "public"."User" USING btree (
  "nickname" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "User_phone_idx" ON "public"."User" USING btree (
  "phone" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User" USING btree (
  "phone" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "User_points_idx" ON "public"."User" USING btree (
  "points" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table User
-- ----------------------------
ALTER TABLE "public"."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table UserMessage
-- ----------------------------
CREATE INDEX "UserMessage_createdAt_idx" ON "public"."UserMessage" USING btree (
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "UserMessage_userId_idx" ON "public"."UserMessage" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table UserMessage
-- ----------------------------
ALTER TABLE "public"."UserMessage" ADD CONSTRAINT "UserMessage_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table UserRoleRelation
-- ----------------------------
CREATE INDEX "UserRoleRelation_roleId_idx" ON "public"."UserRoleRelation" USING btree (
  "roleId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "UserRoleRelation_userId_idx" ON "public"."UserRoleRelation" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "UserRoleRelation_userId_roleId_key" ON "public"."UserRoleRelation" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "roleId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table UserRoleRelation
-- ----------------------------
ALTER TABLE "public"."UserRoleRelation" ADD CONSTRAINT "UserRoleRelation_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table VerificationCode
-- ----------------------------
CREATE INDEX "VerificationCode_phone_code_idx" ON "public"."VerificationCode" USING btree (
  "phone" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "code" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "VerificationCode_phone_expiresAt_idx" ON "public"."VerificationCode" USING btree (
  "phone" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST,
  "expiresAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table VerificationCode
-- ----------------------------
ALTER TABLE "public"."VerificationCode" ADD CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table WithdrawRecord
-- ----------------------------
CREATE INDEX "WithdrawRecord_createdAt_idx" ON "public"."WithdrawRecord" USING btree (
  "createdAt" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);
CREATE INDEX "WithdrawRecord_status_idx" ON "public"."WithdrawRecord" USING btree (
  "status" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "WithdrawRecord_taskId_idx" ON "public"."WithdrawRecord" USING btree (
  "taskId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "WithdrawRecord_userId_idx" ON "public"."WithdrawRecord" USING btree (
  "userId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table WithdrawRecord
-- ----------------------------
ALTER TABLE "public"."WithdrawRecord" ADD CONSTRAINT "WithdrawRecord_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table Article
-- ----------------------------
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ArticleCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ArticleCategory
-- ----------------------------
ALTER TABLE "public"."ArticleCategory" ADD CONSTRAINT "ArticleCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."ArticleCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ArticleComment
-- ----------------------------
ALTER TABLE "public"."ArticleComment" ADD CONSTRAINT "ArticleComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."ArticleComment" ADD CONSTRAINT "ArticleComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "public"."ArticleComment" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."ArticleComment" ADD CONSTRAINT "ArticleComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ArticleCommentLike
-- ----------------------------
ALTER TABLE "public"."ArticleCommentLike" ADD CONSTRAINT "ArticleCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."ArticleComment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ArticleCommentLike" ADD CONSTRAINT "ArticleCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ConfigImageValue
-- ----------------------------
ALTER TABLE "public"."ConfigImageValue" ADD CONSTRAINT "ConfigImageValue_configId_fkey" FOREIGN KEY ("configId") REFERENCES "public"."Config" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ConfigMultiContentValue
-- ----------------------------
ALTER TABLE "public"."ConfigMultiContentValue" ADD CONSTRAINT "ConfigMultiContentValue_configId_fkey" FOREIGN KEY ("configId") REFERENCES "public"."Config" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ConfigMultiImageValue
-- ----------------------------
ALTER TABLE "public"."ConfigMultiImageValue" ADD CONSTRAINT "ConfigMultiImageValue_configId_fkey" FOREIGN KEY ("configId") REFERENCES "public"."Config" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ConfigMultiTextValue
-- ----------------------------
ALTER TABLE "public"."ConfigMultiTextValue" ADD CONSTRAINT "ConfigMultiTextValue_configId_fkey" FOREIGN KEY ("configId") REFERENCES "public"."Config" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ConfigTextValue
-- ----------------------------
ALTER TABLE "public"."ConfigTextValue" ADD CONSTRAINT "ConfigTextValue_configId_fkey" FOREIGN KEY ("configId") REFERENCES "public"."Config" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Course
-- ----------------------------
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."CourseCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "public"."CourseDirection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table CourseChapter
-- ----------------------------
ALTER TABLE "public"."CourseChapter" ADD CONSTRAINT "CourseChapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."CourseChapter" ADD CONSTRAINT "CourseChapter_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."CourseChapter" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."CourseChapter" ADD CONSTRAINT "CourseChapter_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table CourseChapterLog
-- ----------------------------
ALTER TABLE "public"."CourseChapterLog" ADD CONSTRAINT "CourseChapterLog_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "public"."CourseChapter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."CourseChapterLog" ADD CONSTRAINT "CourseChapterLog_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."CourseChapterLog" ADD CONSTRAINT "CourseChapterLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table CourseComment
-- ----------------------------
ALTER TABLE "public"."CourseComment" ADD CONSTRAINT "CourseComment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."CourseComment" ADD CONSTRAINT "CourseComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."CourseComment" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."CourseComment" ADD CONSTRAINT "CourseComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table CourseCommentLike
-- ----------------------------
ALTER TABLE "public"."CourseCommentLike" ADD CONSTRAINT "CourseCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."CourseComment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."CourseCommentLike" ADD CONSTRAINT "CourseCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table CourseFavorite
-- ----------------------------
ALTER TABLE "public"."CourseFavorite" ADD CONSTRAINT "CourseFavorite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."CourseFavorite" ADD CONSTRAINT "CourseFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table CourseLike
-- ----------------------------
ALTER TABLE "public"."CourseLike" ADD CONSTRAINT "CourseLike_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."CourseLike" ADD CONSTRAINT "CourseLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table CourseOrder
-- ----------------------------
ALTER TABLE "public"."CourseOrder" ADD CONSTRAINT "CourseOrder_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "public"."CourseChapter" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."CourseOrder" ADD CONSTRAINT "CourseOrder_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."CourseOrder" ADD CONSTRAINT "CourseOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table CourseRating
-- ----------------------------
ALTER TABLE "public"."CourseRating" ADD CONSTRAINT "CourseRating_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."CourseRating" ADD CONSTRAINT "CourseRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ForumComment
-- ----------------------------
ALTER TABLE "public"."ForumComment" ADD CONSTRAINT "ForumComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumComment" ADD CONSTRAINT "ForumComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."ForumComment" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."ForumComment" ADD CONSTRAINT "ForumComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."ForumPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ForumCommentDislike
-- ----------------------------
ALTER TABLE "public"."ForumCommentDislike" ADD CONSTRAINT "ForumCommentDislike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."ForumComment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumCommentDislike" ADD CONSTRAINT "ForumCommentDislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ForumCommentLike
-- ----------------------------
ALTER TABLE "public"."ForumCommentLike" ADD CONSTRAINT "ForumCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."ForumComment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumCommentLike" ADD CONSTRAINT "ForumCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ForumCommentReport
-- ----------------------------
ALTER TABLE "public"."ForumCommentReport" ADD CONSTRAINT "ForumCommentReport_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."ForumComment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumCommentReport" ADD CONSTRAINT "ForumCommentReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ForumPost
-- ----------------------------
ALTER TABLE "public"."ForumPost" ADD CONSTRAINT "ForumPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumPost" ADD CONSTRAINT "ForumPost_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."ForumSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ForumPostFavorite
-- ----------------------------
ALTER TABLE "public"."ForumPostFavorite" ADD CONSTRAINT "ForumPostFavorite_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."ForumPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumPostFavorite" ADD CONSTRAINT "ForumPostFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ForumPostLike
-- ----------------------------
ALTER TABLE "public"."ForumPostLike" ADD CONSTRAINT "ForumPostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."ForumPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumPostLike" ADD CONSTRAINT "ForumPostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ForumPostReport
-- ----------------------------
ALTER TABLE "public"."ForumPostReport" ADD CONSTRAINT "ForumPostReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."ForumPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumPostReport" ADD CONSTRAINT "ForumPostReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ForumSection
-- ----------------------------
ALTER TABLE "public"."ForumSection" ADD CONSTRAINT "ForumSection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ForumCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumSection" ADD CONSTRAINT "ForumSection_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumSection" ADD CONSTRAINT "ForumSection_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."ForumSection" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table ForumSectionFavorite
-- ----------------------------
ALTER TABLE "public"."ForumSectionFavorite" ADD CONSTRAINT "ForumSectionFavorite_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."ForumSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."ForumSectionFavorite" ADD CONSTRAINT "ForumSectionFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table GameRegistration
-- ----------------------------
ALTER TABLE "public"."GameRegistration" ADD CONSTRAINT "GameRegistration_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."GameRegistration" ADD CONSTRAINT "GameRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Order
-- ----------------------------
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table RolePermission
-- ----------------------------
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Task
-- ----------------------------
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."TaskCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table TaskApplication
-- ----------------------------
ALTER TABLE "public"."TaskApplication" ADD CONSTRAINT "TaskApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."TaskApplication" ADD CONSTRAINT "TaskApplication_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table TaskAssignment
-- ----------------------------
ALTER TABLE "public"."TaskAssignment" ADD CONSTRAINT "TaskAssignment_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."TaskAssignment" ADD CONSTRAINT "TaskAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table TaskComment
-- ----------------------------
ALTER TABLE "public"."TaskComment" ADD CONSTRAINT "TaskComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."TaskComment" ADD CONSTRAINT "TaskComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."TaskComment" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table TaskCommentLike
-- ----------------------------
ALTER TABLE "public"."TaskCommentLike" ADD CONSTRAINT "TaskCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."TaskComment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."TaskCommentLike" ADD CONSTRAINT "TaskCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table TaskFavorite
-- ----------------------------
ALTER TABLE "public"."TaskFavorite" ADD CONSTRAINT "TaskFavorite_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."TaskFavorite" ADD CONSTRAINT "TaskFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table TaskLike
-- ----------------------------
ALTER TABLE "public"."TaskLike" ADD CONSTRAINT "TaskLike_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."TaskLike" ADD CONSTRAINT "TaskLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table UserMessage
-- ----------------------------
ALTER TABLE "public"."UserMessage" ADD CONSTRAINT "UserMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table UserRoleRelation
-- ----------------------------
ALTER TABLE "public"."UserRoleRelation" ADD CONSTRAINT "UserRoleRelation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."UserRoleRelation" ADD CONSTRAINT "UserRoleRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table WithdrawRecord
-- ----------------------------
ALTER TABLE "public"."WithdrawRecord" ADD CONSTRAINT "WithdrawRecord_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."WithdrawRecord" ADD CONSTRAINT "WithdrawRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
