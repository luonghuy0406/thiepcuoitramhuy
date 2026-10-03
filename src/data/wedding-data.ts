export interface WeddingData {
  groom: {
    fullName: string;
    shortName: string;
    fatherName: string;
    motherName: string;
    location: string;
    avatar: string;
    bankName: string;
    accountNumber: string;
    qrCode: string;
  };
  bride: {
    fullName: string;
    shortName: string;
    fatherName: string;
    motherName: string;
    location: string;
    avatar: string;
    bankName: string;
    accountNumber: string;
    qrCode: string;
  };
  event: {
    title: string;
    subtitle: string;
    dateISO: string; // 2026-12-15T10:30:00+07:00
    dateDisplay: string;
    dayOfWeek: string;
    day: number;
    month: number;
    year: number;
    time: string;
    lunarDate: string;
    lunarDateDisplay?: string;
    ceremonyType?: string;
    venueName: string;
    venueAddress: string;
    mapQuery: string;
  };
  timeline: {
    time: string;
    title: string;
    description?: string;
  }[];
  music: {
    title: string;
    url: string;
  };
  gallery: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  loveStory: {
    year: string;
    date: string;
    title: string;
    description: string;
    image: string;
  }[];
  dressCode: {
    title: string;
    description: string;
    colors: {
      name: string;
      hex: string;
      textColor: string;
      tag: string;
    }[];
    notes: string;
  };
  programSchedule: {
    time: string;
    title: string;
    description: string;
    icon: string;
  }[];
  guestNotes: {
    title: string;
    description: string;
    icon: string;
  }[];
  thankYou: {
    title: string;
    subtitle: string;
    message: string;
    groomSignature: string;
    brideSignature: string;
  };
}

export const weddingData: WeddingData = {
  groom: {
    fullName: "Nguyễn Lương Huy",
    shortName: "Lương Huy",
    fatherName: "Ông: Nguyễn Ngọc Thành",
    motherName: "Bà: Võ Thị Sô",
    location: "Huế",
    avatar: "/assets/groom-avatar.jpg",
    bankName: "Vietcombank",
    accountNumber: "9383393232",
    qrCode: "/assets/groom-qr.png",
  },
  bride: {
    fullName: "Bùi Huỳnh Ngọc Trâm",
    shortName: "Ngọc Trâm",
    fatherName: "Ông: Bùi Ngọc Hà",
    motherName: "Bà: Huỳnh Thị Phương",
    location: "Quy Nhơn",
    avatar: "/assets/bride-avatar.jpg",
    bankName: "Vietcombank",
    accountNumber: "0051000562062",
    qrCode: "/assets/bride-qr.png",
  },
  event: {
    title: "Tiệc Mừng Lễ Vu Quy",
    subtitle: "WEDDING INVITATION",
    ceremonyType: "LỄ VU QUY",
    dateISO: "2026-12-15T10:30:00+07:00",
    dateDisplay: "15 Tháng 12 Năm 2026",
    dayOfWeek: "Thứ Năm",
    day: 15,
    month: 12,
    year: 2026,
    time: "10:30",
    lunarDate: "Ngày 17 Tháng 11 Năm Bính Ngọ",
    lunarDateDisplay: "Tức ngày 17 tháng 11 âm Bính Ngọ",
    venueName: "TRỐNG ĐỒNG PALACE",
    venueAddress: "18A Lý Văn Phúc, P. Ô Chợ Dừa, TP. Hà Nội",
    mapQuery: "Trống Đồng Palace, 18A Lý Văn Phúc, Đống Đa, Hà Nội",
  },
  timeline: [
    {
      time: "08:00",
      title: "Lễ Rước Dâu",
      description: "Nghi lễ truyền thống tại tư gia",
    },
    {
      time: "10:30",
      title: "Khai Tiệc Mừng Cưới",
      description: "Đón tiếp quan khách & dùng tiệc",
    },
    {
      time: "12:00",
      title: "Chụp Ảnh Kỷ Niệm",
      description: "Lưu giữ khoảnh khắc đáng nhớ cùng cô dâu & chú rể",
    },
    {
      time: "18:00",
      title: "After Party",
      description: "Âm nhạc và lời chúc phúc từ bạn bè",
    },
  ],
  music: {
    title: "Lễ Đường - Kai Đinh",
    url: "/audio/wedding-music.mp3",
  },
  gallery: [
    {
      src: "/assets/gallery-01.jpg",
      alt: "Khoảnh khắc hạnh phúc của Ngọc Trâm & Lương Huy",
    },
    {
      src: "/assets/gallery-02.png",
      alt: "Cô dâu Ngọc Trâm xinh đẹp rạng rỡ",
    },
    {
      src: "/assets/gallery-03.jpg",
      alt: "Chân dung cô dâu bên bó hoa cưới",
    },
    {
      src: "/assets/gallery-04.jpg",
      alt: "Chú rể Lương Huy lịch lãm",
    },
    {
      src: "/assets/gallery-05.jpg",
      alt: "Đôi uyên ương cùng chung bước",
    },
    {
      src: "/assets/gallery-06.jpg",
      alt: "Ngọt ngào từng ánh mắt",
    },
    {
      src: "/assets/gallery-07.jpg",
      alt: "Nụ cười trọn vẹn yêu thương",
    },
    {
      src: "/assets/gallery-08.jpg",
      alt: "Khoảnh khắc tình yêu nở hoa",
    },
    {
      src: "/assets/gallery-09.jpg",
      alt: "Forever and Always",
    },
  ],
  loveStory: [
    {
      year: "2021",
      date: "Tháng 09, 2021",
      title: "Lần Đầu Gặp Gỡ",
      description:
        "Khoảnh khắc hai ánh mắt vô tình giao nhau giữa một chiều thu dịu dàng. Định mệnh đã đưa chúng mình tìm thấy nhau.",
      image: "/assets/gallery-06.jpg",
    },
    {
      year: "2022",
      date: "Tháng 05, 2022",
      title: "Chạm Ngõ Trái Tim",
      description:
        "Sau những buổi chuyện trò dưới ánh đèn phố, chúng mình chính thức nắm tay nhau bắt đầu hành trình yêu thương.",
      image: "/assets/gallery-05.jpg",
    },
    {
      year: "2024",
      date: "Tháng 11, 2024",
      title: "Hành Trình Thanh Xuân",
      description:
        "Cùng nhau ngắm hoàng hôn Quy Nhơn, lướt qua những góc phố cổ xứ Huế, sẻ chia mọi buồn vui của tuổi trẻ.",
      image: "/assets/gallery-07.jpg",
    },
    {
      year: "2026",
      date: "Tháng 03, 2026",
      title: "Lời Cầu Hôn Ngọt Ngào",
      description:
        "Dưới ánh hoàng hôn lãng mạn, anh trao chiếc nhẫn ước hẹn và em nghẹn ngào: 'Em đồng ý!'. Chúng mình cùng về chung một nhà.",
      image: "/assets/gallery-08.jpg",
    },
  ],
  dressCode: {
    title: "Gợi Ý Trang Phục",
    description:
      "Để những khung hình kỷ niệm cùng cô dâu & chú rể thêm phần lung linh, quý khách có thể ưu tiên lựa chọn các tông màu trang phục gợi ý:",
    colors: [
      {
        name: "Đỏ Rượu",
        hex: "#b16964",
        textColor: "#ffffff",
        tag: "Burgundy",
      },
      {
        name: "Hồng Phấn",
        hex: "#e49696",
        textColor: "#ffffff",
        tag: "Rose Pastel",
      },
      {
        name: "Be Nhạt",
        hex: "#f0dfce",
        textColor: "#b16964",
        tag: "Champagne",
      },
      {
        name: "Trắng",
        hex: "#ffffff",
        textColor: "#333333",
        tag: "Elegant White",
      },
    ],
    notes:
      "Quý khách vui lòng tránh trang phục màu tối sẫm hoặc quá sặc sỡ để không gian tiệc luôn giữ được nét trang nhã, ấm áp.",
  },
  programSchedule: [
    {
      time: "10:00",
      title: "Đón Tiếp & Tiệc Trà",
      description:
        "Chào đón quý khách, thưởng thức tiệc trà nhẹ và chụp ảnh lưu niệm tại Photobooth hoa tươi.",
      icon: "coffee",
    },
    {
      time: "10:30",
      title: "Nghi Thức Lễ Cưới",
      description:
        "Cô dâu chú rể bước vào lễ đường, trao lời thề nguyện và nhẫn cưới thiêng liêng.",
      icon: "ring",
    },
    {
      time: "11:00",
      title: "Khai Tiệc Mừng",
      description:
        "Cùng gia đình nâng ly chúc phúc và thưởng thức thực đơn ẩm thực tinh hoa.",
      icon: "wine",
    },
    {
      time: "11:45",
      title: "Minigame & Bốc Thăm",
      description:
        "Tham gia các trò chơi tương tác thú vị cùng những phần quà tri ân bất ngờ.",
      icon: "gift",
    },
    {
      time: "12:15",
      title: "Tung Hoa & After Party",
      description:
        "Khoảnh khắc may mắn trao hoa cưới cùng âm nhạc sôi động chia sẻ niềm vui.",
      icon: "music",
    },
  ],
  guestNotes: [
    {
      title: "Bãi Đỗ Xe Tiện Lợi",
      description: "Bãi đỗ xe ô tô và xe máy rộng rãi, miễn phí ngay tại sảnh The Artisan.",
      icon: "car",
    },
    {
      title: "Check-in Photobooth",
      description: "Khu vực chụp ảnh hoa tươi mở cửa từ 09:45, hãy cùng chụp hình kỷ niệm nhé!",
      icon: "camera",
    },
    {
      title: "Không Gian Tiệc Kín",
      description: "Để bảo vệ sức khoẻ cho trẻ nhỏ và người lớn tuổi, tiệc cưới nói không với khói thuốc.",
      icon: "heart",
    },
  ],
  thankYou: {
    title: "Lời Cảm Tạ",
    subtitle: "THANK YOU FOR BEING WITH US",
    message:
      "Tình yêu không chỉ là tìm thấy một người để cùng đi qua năm tháng, mà là cùng nhau sẻ chia niềm hạnh phúc với những người thân thương nhất. Cảm ơn sự hiện diện và những lời chúc phúc ngọt ngào của bạn đã làm cho ngày cưới của chúng mình trở nên trọn vẹn và đáng nhớ hơn bao giờ hết!",
    brideSignature: "Ngọc Trâm",
    groomSignature: "Lương Huy",
  },
};
