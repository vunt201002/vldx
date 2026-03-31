/**
 * Seed sample blog posts for testing.
 * Usage: npx ts-node -r tsconfig-paths/register src/scripts/seedBlogPosts.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BlogPost from '../models/BlogPost';
import { config } from '../config/env';

dotenv.config();

const posts = [
  {
    title: 'Huong dan chon gach op lat cho phong khach sang trong',
    excerpt: 'Gach op lat la yeu to quan trong quyet dinh tham my cua ngoi nha. Bai viet nay se giup ban chon dung loai gach phu hop voi phong khach.',
    content: `<p>Phong khach la khong gian quan trong nhat cua ngoi nha, noi tiep don khach va the hien gu tham my cua gia chu. Viec chon gach op lat phu hop se tao nen su sang trong va am cung.</p>
<h2>1. Gach men bong</h2>
<p>Gach men bong co be mat nhan min, phan chieu anh sang tot, tao cam giac rong rai cho khong gian. Kich thuoc pho bien: 60x60cm, 80x80cm.</p>
<h2>2. Gach van da</h2>
<p>Gach van da marble mang lai ve dep tu nhien, sang trong. Day la lua chon hang dau cho cac phong khach hien dai.</p>
<h2>3. Gach van go</h2>
<p>Neu ban thich su am cung cua go nhung lo ngai ve do ben, gach van go la giai phap hoan hao. Gach co be mat giong go that nhung chong tray va de ve sinh.</p>
<p>Lien he VLXD de duoc tu van chi tiet ve cac loai gach op lat chat luong cao.</p>`,
    tags: ['gach op lat', 'noi that', 'huong dan'],
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop',
    viewCount: 156,
  },
  {
    title: 'Top 5 loai xi mang tot nhat cho cong trinh dan dung 2026',
    excerpt: 'So sanh cac loai xi mang pho bien tren thi truong Viet Nam, giup ban chon dung san pham cho cong trinh cua minh.',
    content: `<p>Xi mang la vat lieu khong the thieu trong bat ky cong trinh xay dung nao. Viec chon dung loai xi mang anh huong truc tiep den chat luong va tuoi tho cong trinh.</p>
<h2>1. Xi mang Ha Tien PCB40</h2>
<p>Thuong hieu lau doi, chat luong on dinh. Phu hop cho mong, cot, dam nha dan dung.</p>
<h2>2. Xi mang Hoang Thach</h2>
<p>Xi mang Portland hon hop, cuong do cao, phu hop cho cac cong trinh lon.</p>
<h2>3. Xi mang Nghi Son</h2>
<p>San pham moi noi, gia canh tranh, chat luong dang tin cay.</p>
<h2>4. Xi mang The Vissai</h2>
<p>Xi mang trang dung cho cong trinh trang tri, hoan thien.</p>
<h2>5. Xi mang INSEE</h2>
<p>Xi mang nhap khau, cuong do cao, thoi gian dong ket nhanh.</p>`,
    tags: ['xi mang', 'vat lieu', 'so sanh'],
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=500&fit=crop',
    viewCount: 234,
  },
  {
    title: 'Cach tinh luong thep xay nha cap 4 chinh xac nhat',
    excerpt: 'Bai viet huong dan chi tiet cach tinh luong thep can thiet cho nha cap 4, giup tiet kiem chi phi ma van dam bao ket cau.',
    content: `<p>Thep la vat lieu gia co cho cac ket cau be tong cot thep. Viec tinh toan chinh xac luong thep giup tiet kiem chi phi va dam bao an toan.</p>
<h2>Cong thuc tinh thep mong</h2>
<p>Mong bang: Thep doc phi 12-16mm, thep dai phi 6-8mm, buoc 200mm.</p>
<h2>Thep cot</h2>
<p>Cot nha cap 4 thuong dung 4 cay phi 14-16mm, dai buoc 150-200mm.</p>
<h2>Thep dam</h2>
<p>Dam chinh dung thep phi 16-18mm, dam phu phi 12-14mm.</p>
<p>Tong luong thep trung binh cho nha cap 4 khoang 50-70kg/m2 san.</p>`,
    tags: ['thep', 'xay dung', 'huong dan'],
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=500&fit=crop',
    viewCount: 189,
  },
  {
    title: 'Xu huong thiet ke nha o nam 2026: Hien dai va ben vung',
    excerpt: 'Kham pha nhung xu huong thiet ke nha o noi bat trong nam 2026 voi phong cach hien dai, than thien moi truong.',
    content: `<p>Nam 2026, xu huong thiet ke nha o tap trung vao su ben vung va cong nghe thong minh.</p>
<h2>1. Nha xanh - Green Building</h2>
<p>Su dung vat lieu tai che, he thong nang luong mat troi, va vuon tren mai.</p>
<h2>2. Khong gian mo</h2>
<p>Thiet ke open-plan ket hop phong khach, bep va phong an thanh mot khong gian thong thoang.</p>
<h2>3. Smart Home</h2>
<p>Tich hop cong nghe IoT de dieu khien den, dieu hoa, rem cua tu dong.</p>
<h2>4. Vat lieu tu nhien</h2>
<p>Go tu nhien, da tu nhien, gach khong nung duoc ua chuong.</p>`,
    tags: ['thiet ke', 'xu huong', 'nha o'],
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop',
    viewCount: 312,
  },
  {
    title: 'Son nha mau gi dep? Bang mau son noi that 2026',
    excerpt: 'Tong hop cac mau son noi that dep va pho bien nhat nam 2026, giup ban chon mau son phu hop cho tung khong gian.',
    content: `<p>Mau son noi that anh huong lon den cam xuc va tham my cua khong gian song. Hay cung kham pha xu huong mau son 2026.</p>
<h2>Mau trang kem</h2>
<p>Mau trang kem tao cam giac am ap, sang sua ma khong qua lanh. Phu hop phong khach, phong ngu.</p>
<h2>Mau xanh la nhat</h2>
<p>Mau xanh sage green la xu huong noi bat, mang lai cam giac thu gian va gan gui thien nhien.</p>
<h2>Mau be dat</h2>
<p>Tone mau earthy, am ap, phu hop voi noi that go tu nhien.</p>
<h2>Mau xam nhat</h2>
<p>Hien dai, tinh te, de phoi hop voi nhieu phong cach noi that.</p>`,
    tags: ['son', 'noi that', 'mau sac'],
    coverImage: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=800&h=500&fit=crop',
    viewCount: 278,
  },
  {
    title: 'Tam op cau thang: Lua chon vat lieu va thi cong',
    excerpt: 'Huong dan chon vat lieu tam op cau thang pho bien nhu da granite, go tu nhien, gach men va cach thi cong chuan.',
    content: `<p>Cau thang la diem nhan trong thiet ke noi that. Viec chon vat lieu op cau thang phu hop se nang tam tham my cho ngoi nha.</p>
<h2>Da granite</h2>
<p>Ben dep, sang trong, phu hop cau thang phong khach. Gia tu 500.000 - 1.500.000 VND/m2.</p>
<h2>Go tu nhien</h2>
<p>Am ap, trang nha, nhung can bao duong dinh ky. Gia tu 800.000 - 2.000.000 VND/m2.</p>
<h2>Gach men</h2>
<p>Kinh te, da dang mau ma, de ve sinh. Gia tu 150.000 - 500.000 VND/m2.</p>`,
    tags: ['tam op', 'cau thang', 'vat lieu'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop',
    viewCount: 145,
  },
  {
    title: 'Bang gia cat xay dung moi nhat thang 4/2026',
    excerpt: 'Cap nhat bang gia cat xay dung cac loai tai TP.HCM va Ha Noi, giup ban du toan chi phi chinh xac.',
    content: `<p>Cat la vat lieu co ban trong xay dung. Gia cat bien dong theo mua va khu vuc. Duoi day la bang gia tham khao thang 4/2026.</p>
<h2>Cat san lap</h2>
<p>Gia: 120.000 - 180.000 VND/m3. Dung de san lap mat bang, nen nha.</p>
<h2>Cat xay</h2>
<p>Gia: 250.000 - 350.000 VND/m3. Dung de xay tuong, trat tuong.</p>
<h2>Cat bang</h2>
<p>Gia: 200.000 - 300.000 VND/m3. Dung de do be tong.</p>
<p><strong>Luu y:</strong> Gia tren chua bao gom phi van chuyen. Lien he VLXD de nhan bao gia chinh xac.</p>`,
    tags: ['cat', 'gia ca', 'vat lieu'],
    coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=500&fit=crop',
    viewCount: 423,
  },
  {
    title: 'Ghe da cong vien: Cac mau dep va ben cho khong gian ngoai troi',
    excerpt: 'Tong hop cac mau ghe da cong vien dep, ben, phu hop cho san vuon, khu do thi va cong trinh cong cong.',
    content: `<p>Ghe da cong vien la san pham khong the thieu trong thiet ke canh quan ngoai troi. Voi do ben cao va tinh tham my, ghe da ngay cang duoc ua chuong.</p>
<h2>Ghe da granite nguyen khoi</h2>
<p>Do ben vuot troi, chiu duoc moi thoi tiet. Phu hop cong vien, quang truong.</p>
<h2>Ghe da nhan tao</h2>
<p>Nhe hon, da dang mau sac va kich thuoc. Gia thanh hop ly hon da tu nhien.</p>
<h2>Ghe da ket hop go</h2>
<p>Su ket hop giua da va go tao nen phong cach hien dai, am ap. Rat phu hop cho quan cafe, resort.</p>`,
    tags: ['ghe da', 'cong vien', 'ngoai that'],
    coverImage: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&h=500&fit=crop',
    viewCount: 167,
  },
  {
    title: 'So sanh gach khong nung va gach dat nung truyen thong',
    excerpt: 'Phan tich uu nhuoc diem cua gach khong nung va gach dat nung de giup ban lua chon phu hop cho cong trinh.',
    content: `<p>Gach khong nung dang dan thay the gach dat nung truyen thong tai Viet Nam. Hay cung so sanh hai loai gach nay.</p>
<h2>Gach dat nung</h2>
<p>Uu diem: Cach nhiet tot, cach am tot, do ben cao. Nhuoc diem: Gay o nhiem moi truong, gia cao hon.</p>
<h2>Gach khong nung</h2>
<p>Uu diem: Than thien moi truong, gia re hon, trong luong nhe. Nhuoc diem: Cach nhiet kem hon, de nut khi chiu luc.</p>
<h2>Ket luan</h2>
<p>Moi loai gach deu co uu nhuoc diem rieng. Can chon loai phu hop voi vi tri su dung va ngan sach.</p>`,
    tags: ['gach', 'so sanh', 'vat lieu'],
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop',
    viewCount: 198,
  },
  {
    title: 'Kinh nghiem chong tham san thuong hieu qua',
    excerpt: 'Huong dan cac phuong phap chong tham san thuong pho bien, tu dung hoa chat den dung mang chong tham.',
    content: `<p>Chong tham san thuong la van de quan trong, dac biet trong mua mua. Neu khong xu ly tot, nuoc tham se lam hu hai ket cau va noi that.</p>
<h2>1. Chong tham bang Sika</h2>
<p>Sika la thuong hieu chong tham pho bien nhat. San pham Sika 107 va Sika Latex duoc su dung rong rai.</p>
<h2>2. Mang chong tham</h2>
<p>Mang chong tham tu dinh (membrane) tao lop bao ve hieu qua, tuoi tho 10-15 nam.</p>
<h2>3. Son chong tham</h2>
<p>Giai phap don gian, de thi cong. Phu hop cho cac vi tri khong chiu ap luc nuoc lon.</p>
<p>Can ket hop nhieu phuong phap de dat hieu qua chong tham tot nhat.</p>`,
    tags: ['chong tham', 'san thuong', 'huong dan'],
    coverImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=500&fit=crop',
    viewCount: 287,
  },
];

async function seed() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  // Drop stale slug index if it exists
  try {
    await BlogPost.collection.dropIndex('slug_1');
    console.log('  Dropped stale slug_1 index\n');
  } catch { /* index doesn't exist, fine */ }

  let created = 0;
  for (const data of posts) {
    const existing = await BlogPost.findOne({ title: data.title });
    if (existing) {
      console.log(`  Skip (exists): ${data.title}`);
      continue;
    }
    await BlogPost.create({
      ...data,
      isPublished: true,
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // random within last 7 days
      likes: [],
      comments: [],
    });
    created++;
    console.log(`  Created: ${data.title}`);
  }

  console.log(`\nDone! Created ${created} posts (${posts.length - created} already existed).`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
