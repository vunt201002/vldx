import mongoose from 'mongoose';
import { Material } from '../models/Material';
import { connectDB } from '../config/database';

const materials = [
  {
    name: 'Xi Mang Holcim PCB40',
    description: 'Xi măng đa dụng Holcim PCB40, phù hợp cho xây dựng dân dụng và công nghiệp.',
    price: 95000,
    category: 'xi-mang',
    images: [],
    specs: new Map([['trong-luong', '50kg'], ['mac', 'PCB40'], ['thuong-hieu', 'Holcim']]),
    inStock: true,
  },
  {
    name: 'Xi Mang Nghi Son PC50',
    description: 'Xi măng Nghi Sơn PC50 cường độ cao, dùng cho kết cấu bê tông cốt thép.',
    price: 105000,
    category: 'xi-mang',
    images: [],
    specs: new Map([['trong-luong', '50kg'], ['mac', 'PC50'], ['thuong-hieu', 'Nghi Son']]),
    inStock: true,
  },
  {
    name: 'Gach Ong 4 Lo',
    description: 'Gạch ống 4 lỗ kích thước 80x80x180mm, dùng xây tường ngăn.',
    price: 1200,
    category: 'gach',
    images: [],
    specs: new Map([['kich-thuoc', '80x80x180mm'], ['loai', '4 lo']]),
    inStock: true,
  },
  {
    name: 'Gach The 6 Lo',
    description: 'Gạch thẻ 6 lỗ kích thước 90x140x190mm, chịu lực tốt.',
    price: 2500,
    category: 'gach',
    images: [],
    specs: new Map([['kich-thuoc', '90x140x190mm'], ['loai', '6 lo']]),
    inStock: true,
  },
  {
    name: 'Son Noi That Dulux Easy Clean',
    description: 'Sơn nội thất Dulux Easy Clean lau chùi hiệu quả, 5 lít.',
    price: 850000,
    category: 'cat-son',
    images: [],
    specs: new Map([['the-tich', '5 lit'], ['loai', 'noi that'], ['thuong-hieu', 'Dulux']]),
    inStock: true,
  },
  {
    name: 'Son Ngoai That Jotun Jotashield',
    description: 'Sơn ngoại thất Jotun Jotashield chống thời tiết, 5 lít.',
    price: 920000,
    category: 'cat-son',
    images: [],
    specs: new Map([['the-tich', '5 lit'], ['loai', 'ngoai that'], ['thuong-hieu', 'Jotun']]),
    inStock: true,
  },
  {
    name: 'Thep Hoa Phat D10',
    description: 'Thép cuộn Hòa Phát D10 dùng cho kết cấu bê tông cốt thép.',
    price: 15800,
    category: 'thep',
    images: [],
    specs: new Map([['duong-kinh', 'D10'], ['don-vi', 'kg'], ['thuong-hieu', 'Hoa Phat']]),
    inStock: true,
  },
  {
    name: 'Thep Hoa Phat D16',
    description: 'Thép thanh vằn Hòa Phát D16 cường độ cao.',
    price: 15500,
    category: 'thep',
    images: [],
    specs: new Map([['duong-kinh', 'D16'], ['don-vi', 'kg'], ['thuong-hieu', 'Hoa Phat']]),
    inStock: false,
  },
  {
    name: 'Da 1x2 Xay Dung',
    description: 'Đá 1x2 dùng đổ bê tông, nền móng. Bán theo khối.',
    price: 350000,
    category: 'da',
    images: [],
    specs: new Map([['kich-co', '1x2cm'], ['don-vi', 'm3']]),
    inStock: true,
  },
  {
    name: 'Cat San Lap',
    description: 'Cát san lấp mặt bằng, nền móng công trình.',
    price: 180000,
    category: 'cat',
    images: [],
    specs: new Map([['loai', 'san lap'], ['don-vi', 'm3']]),
    inStock: true,
  },
  {
    name: 'Cat Xay Dung Loai 1',
    description: 'Cát xây dựng loại 1 sạch, dùng cho trát tường và xây.',
    price: 280000,
    category: 'cat',
    images: [],
    specs: new Map([['loai', 'xay dung loai 1'], ['don-vi', 'm3']]),
    inStock: true,
  },
  {
    name: 'Ong Nuoc PVC Binh Minh D21',
    description: 'Ống nước PVC Bình Minh đường kính 21mm, dài 4m.',
    price: 28000,
    category: 'ong-nuoc',
    images: [],
    specs: new Map([['duong-kinh', '21mm'], ['chieu-dai', '4m'], ['thuong-hieu', 'Binh Minh']]),
    inStock: true,
  },
  {
    name: 'Ong Nuoc PVC Binh Minh D27',
    description: 'Ống nước PVC Bình Minh đường kính 27mm, dài 4m.',
    price: 38000,
    category: 'ong-nuoc',
    images: [],
    specs: new Map([['duong-kinh', '27mm'], ['chieu-dai', '4m'], ['thuong-hieu', 'Binh Minh']]),
    inStock: true,
  },
];

async function seed() {
  try {
    await connectDB();
    await Material.deleteMany({});
    const result = await Material.insertMany(materials);
    console.log(`Seeded ${result.length} materials`);
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
