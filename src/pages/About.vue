<script setup>
const jump = () => {
	window.open('https://qm.qq.com/q/mbwcXuKvLi', '_blank')
}
</script>

<template>
	<div class="about">
		<img
			src="https://pjsk-image-1304757492.cos.ap-chengdu.myqcloud.com/image_storage/d9f7766cc618029c6242ae06ce282477.jpg"
			alt="">

	</div>
	<h2>关于</h2>
	<h3>关于本网站</h3>
	<el-text>使用Vue3/Element-ui +
		<del>Flask</del>
		SpringBoot 驱动
	</el-text>
	<br>
	<el-text>由于神秘的力量，当页面显示不全时尝试刷新</el-text>
	<h3>分类</h3>
	<el-text>使用了六个一级分类：
		生日，庆典（周年活动），2DMV，外服贺图（除日服），人设/设计图（周年活动服，CD专辑曲绘等），其他（剧场版等）
	</el-text>
	<br>
	<el-text>暂无二级分类</el-text>
	<h3>Todo List</h3>
	<ul>
		<li>
			<el-text>[ ] 补完现有所有曲绘</el-text>
		</li>
		<li>
			<el-text>
				<del>[ ] 添加筛选功能</del>
			</el-text>
		</li>
		<li>
			<el-text>[ ] 添加搜索功能</el-text>
		</li>
	</ul>
	<h3>联系</h3>
	<div class="el-text-re">
		<el-text>有任何关于网站建设相关问题可以加群 <img alt="Static Badge" src="https://img.shields.io/badge/QQ%E7%BE%A4%3A-1029940502-blue"  @click="jump"> 讨论</el-text>
	</div>


	<h3>版权声明</h3>
	<blockquote>
<!--		<strong>内容来源与版权归属：</strong>本站所展示的内容均转载自作者源站，相关内容的著作权归原作者或原版权所有者所有，本站并不享有这些内容的版权。-->
<!--		<br>-->
<!--		<strong>目的声明：</strong>本站转载这些内容仅用于学习交流用途。我们严格遵守相关法律法规，未将这些内容用于任何商业盈利活动。-->
<!--		<br>-->
<!--		<strong>侵权处理：</strong>若您发现本站上的内容侵犯了您的合法权益，请及时与我们联系。-->
<!--		<br>-->
<!--		我们将在收到通知后尽快进行核实处理，并根据具体情况采取删除、屏蔽相关内容等措施，以维护您的合法权益。-->
		<strong>内容来源与版权归属：</strong>本站所有展示内容均转载自原作者平台或发布源，相关内容的著作权、版权等一切合法权益，毫无保留地归属于原作者或原版权所有者.
		<br>
		<strong>使用目的：</strong>本站转载这些内容，严格限定在非营利性的学习研究范畴。我们始终秉持对知识产权的尊重，坚决杜绝将这些内容用于任何形式的商业盈利活动，包括但不限于广告投放、付费会员浏览、作品二次售卖等。
		<br>
		<strong>侵权处理：</strong>若您发现本站上的内容侵犯了您的合法权益，请及时与我们联系。我们将在收到通知后尽快进行核实处理，并根据具体情况采取删除、屏蔽相关内容等措施，以维护您的合法权益。
		<br>
		<strong>用户责任：</strong>本站明确提示所有访问用户，在浏览本站内容时，应尊重原作者和版权方的合法权益，不得将本站展示的内容用于任何违法、侵权或未经授权的商业用途。如用户因自身不当使用本站内容而引发的任何法律纠纷，均由用户自行承担全部法律责任，与本站无关。
	</blockquote>

	<div class="about-2">
		<img
			src="https://pjsk-image-1304757492.cos.ap-chengdu.myqcloud.com/image_storage/dc5109f58762772ffbddc1a9f052bf4f.png"
			alt="">

	</div>

	<h3>更新记录</h3>
	<el-text>25/02/12 更换cos对象存储为cloudflare R2</el-text>
	<el-text>25/02/09 更新新筛选器，去掉原有分类</el-text>
	
</template>

<style scoped lang="scss">
ul {
	padding-left: 20px;
}

li {
	list-style-type: '  -  '
}

blockquote {
	border-left: #66BABC 4px solid;
	padding-left: 16px;
	margin-left: 0;
}

.about {
	display: flex;
	flex-direction: column;

	img {
		margin: 4px auto;
		width: 80%;
		overflow: hidden;

	}
}

.about-2 {
	display: flex;
	flex-direction: column;
	justify-content: center;
	img {
		margin: 4px auto;

		overflow: hidden;
		width: fit-content;
		object-fit: cover;
	}
}
.el-text{
	display: flex;
	align-items: center;
	img{
		margin: 0 2px;
		cursor: pointer;
	}
}
</style>