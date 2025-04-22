<!-- 这里的功能是用户上传主页的插画信息,从UserCenter分离以复用 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import PostImage from "@/components/post_information/PostImage.vue";
import requests from "@/utils/requests.js";
import { ACCOUNT_ID, baseUrl } from "@/utils/methods.js";
import COS from "cos-js-sdk-v5";
import CryptoJS from 'crypto-js';
import axios from "axios";
import router from "@/router/router.js";
import { apiConfig } from "@/config/Config.js";

import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 对象存储相关
let cos = '';
let s3 = '';

const getKeyAndId = async () => {
    cos = new COS({
        SecretId: apiConfig.getCosConfig().SecretId,
        SecretKey: apiConfig.getCosConfig().SecretKey
    });

    s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: apiConfig.getS3Config().accessKeyId,
            secretAccessKey: apiConfig.getS3Config().secretAccessKey,
        },
    });

    const characterId = await requests.get(
        `${baseUrl}/api2/character/tree`,
    );
    if (characterId.status === 200) {
        character_options.value = treeToList(characterId.data.data);
    }

    const typeId = await requests.get(
        `${baseUrl}/api2/image_type/tree`,
    );
    if (typeId.status === 200) {
        type_options.value = treeToList(typeId.data.data);
    }
};

// 树转数组
const treeToList = (tree) => {
    let list = [];
    for (let item of tree) {
        list.push({ name: item.name, id: item.id });
        if (item.children.length !== 0) {
            list.push(...treeToList(item.children));
        }
    }
    return list;
};

// 获取子组件相关
const postImageRef = ref(null);

// 初始化
onMounted(() => {
    getKeyAndId();
});

// 表单数据
const formData = ref({
    type: '',
    character: '',
    title: '',
    artiest: '',
    description: '',
    image_url: [],
});

const character_options = ref([]);
const type_options = ref([]);

// 上传封面图片
const uploadTitle = async () => {
    let titleImage = postImageRef.value.returnImageTitle();
    if (titleImage) {
        const name = titleImage.name;
        const exp = name.split('.')[name.split('.').length - 1];
        const newName = CryptoJS.MD5(name + Math.random()).toString() + '.' + exp;

        const url = await getSignedUrl(
            s3,
            new PutObjectCommand({
                Bucket: 'image-storage',
                Key: newName,
            }),
            { expiresIn: 60 * 60 * 24 * 7 }
        );

        const response = new Promise((resolve, reject) => {
            axios.put(url, titleImage.raw, {
                headers: {
                    'Content-Type': 'image/jpeg',
                },
            }).then((res) => {
                if (res.status === 200) {
                    resolve({ 'code': 200 });
                }
            }).catch((err) => {
                console.log(err);
                reject({ 'code': 400 });
            });
        });

        const cosRes = new Promise((resolve, reject) => {
            cos.putObject({
                Bucket: 'pjsk-image-1304757492',
                Region: 'ap-chengdu',
                Key: `image_storage/${newName}`,
                StorageClass: 'STANDARD',
                Body: titleImage.raw
            }, (err, data) => {
                if (data.statusCode === 200 && data.Location) {
                    formData.value.image_url.unshift(`https://${data.Location}`);
                    console.log('title 数据上传完成');
                    resolve({ 'code': 200 });
                } else {
                    console.log(err);
                    reject({ 'code': 400 });
                }
            });
        });

        return Promise.all([response, cosRes]);
    }
};

// 上传其他图片
const uploadOthers = async () => {
    const imageList = postImageRef.value.returnImageList();
    // 允许没有图片
    if (imageList.length === 0) {
        console.log('无图片');
        return { code: 200 };
    }

    const processedImages = imageList.map((item) => {
        const name = item.name;
        const ext = name.split('.').pop();
        const newName = CryptoJS.MD5(name + Math.random()).toString() + '.' + ext;
        return { ...item, newName };
    });

    // 上传图片到服务器
    const uploadPromises = processedImages.map(async (item) => {
        try {
            const url = await getSignedUrl(
                s3,
                new PutObjectCommand({
                    Bucket: 'image-storage',
                    Key: item.newName,
                }),
                { expiresIn: 60 * 60 * 24 * 7 }
            );

            // 使用axios上传图片
            await axios.put(url, item.raw, {
                headers: {
                    'Content-Type': item.raw.type,
                },
            });

            // 使用cos上传图片
            const cosRes = await new Promise((resolve, reject) => {
                cos.putObject({
                    Bucket: 'pjsk-image-1304757492',
                    Region: 'ap-chengdu',
                    Key: `image_storage/${item.newName}`,
                    StorageClass: 'STANDARD',
                    Body: item.raw,
                }, (err, data) => {
                    if (data.statusCode === 200 && data.Location) {
                        formData.value.image_url.push(`https://${data.Location}`);
                        resolve(data.Location);
                    } else {
                        reject(err);
                    }
                });
            });

            console.log('others 数据上传完成');
            return { code: 200, url: `https://${cosRes}` };
        } catch (error) {
            console.error(error);
            return { code: 400, error };
        }
    });

    // 等待所有图片上传完成
    const results = await Promise.all(uploadPromises);
    console.log('all:', results);

    // 检查是否所有图片都上传成功
    const allSuccess = results.every(item => item.code === 200);
    return allSuccess ? { code: 200 } : { code: 400 };
};

// 提交表单
const handleSubmit = async () => {
    if (formData.value.type === '' || formData.value.character === '' || formData.value.title === '' || formData.value.artiest === '' || formData.value.description === '') {
        ElMessage.warning('请填写完整信息');
        return false;
    }

    // 传递封面
    let _uploadTitle = await uploadTitle();
    console.log('title结果');
    console.log(_uploadTitle);

    // 传递其他图片
    let _uploadOthers = await uploadOthers();
    console.log('other结果');
    console.log(_uploadOthers);

    if (_uploadTitle.every(item => item.code === 200) && _uploadOthers.code === 200) {
        console.log(formData.value.image_url);
    } else {
        ElMessage.warning('上传失败，请重试');
        return false;
    }

    const response = await axios.post(
        `${baseUrl}/api2/website_image/add`,
        {
            data: {
                title: formData.value.title,
                image_url: formData.value.image_url,
                image_type_id: formData.value.type,
                character_id: formData.value.character,
                description: formData.value.description,
                illustrator: formData.value.artiest
            },
            token: localStorage.getItem('token2')
        }
    );

    if (response.status === 200) {
        ElMessageBox.alert('上传成功，感谢提交', 'success', {
            confirmButtonText: 'OK',
            callback: (action) => {
                ElMessage({
                    type: 'success',
                    message: `上传成功`,
                });
                router.replace({ path: '/' });
            },
        });
    } else {
        ElMessageBox.alert('图片上传失败，请重试', 'Error', {
            confirmButtonText: 'OK',
            callback: (action) => {
                ElMessage({
                    type: 'info',
                    message: '上传失败',
                });
            },
        });
    }
};
</script>

<template>
    <div class="upload-main-data">
        <div class="upload-container">
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <span>数据上传</span>
                    </div>
                </template>

                <post-image ref="postImageRef"></post-image>

                <!-- 数据表单 -->
                <el-form :model="formData" label-width="80px" class="data-form">
                    <el-form-item label="Ip">
                        <el-input disabled="true" placeholder="世界计划"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="formData.type" placeholder="请选择类型">
                            <el-option v-for="item in type_options" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="角色">
                        <el-select v-model="formData.character" placeholder="请选择角色">
                            <el-option v-for="item in character_options" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="标题">
                        <el-input v-model="formData.title" placeholder="请输入标题" />
                    </el-form-item>

                    <el-form-item label="画师">
                        <el-input v-model="formData.artiest" placeholder="请输入画师名称" />
                    </el-form-item>

                    <el-form-item label="描述">
                        <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入详细描述" />
                    </el-form-item>
                </el-form>

                <div class="submit-area">
                    <el-button type="primary" @click="handleSubmit">
                        提交
                    </el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.upload-main-data {
    min-height: calc(100vh - 58px);

    .upload-container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;

        .box-card {
            padding: 20px;

            .card-header {
                font-size: 18px;
                cursor: default;
            }
        }

        .data-form {
            :deep(.el-form-item__label) {
                font-weight: bold;
            }

            .el-select,
            .el-input {
                width: 100%;
            }
        }

        .submit-area {
            margin-top: 30px;
            text-align: center;

            .el-button {
                width: 200px;
                height: 40px;
            }
        }
    }
}
</style>