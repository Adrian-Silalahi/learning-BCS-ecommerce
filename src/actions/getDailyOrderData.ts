import moment from 'moment';

export default async function getDailyOrderData () {
  try {
    // Intinya syntax dibawah utk Mendapatkan rentang waktu dari 6 hari yang lalu pukul 00:00:00 hingga hari ini pukul 23:59:59,alias mencakup total 7 hari belakangan.
    const startDate = moment().subtract(6, 'days').startOf('day')
    const endDate = moment().endOf('day')

    // Get data createDate dan data harga total masing-masing order yang statusnya complete dan datanya harus 7 hari belakangan
    const completeOrdersInfo = await prisma?.order.groupBy({
      by: ['createDate'],
      where: {
        createDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString()
        },
        status: 'complete'
      },
      // jumlahkan total amount semua orderan yang tanggal create nya sama
      // Sehingga kita akan dapat total amount dalam 1 hari
      _sum: {
        amount: true
      }
    })

    // Inisialisasi objek untuk mengumpulkan data orderan dalam 1 hari
        const dailyOrderData: {
            [day: string] : {
                day: string;
                date: string;
                totalAmount: number
        }
    } = {}

    // Buat salinan dari tanggal awal kemudian melakukan perulangan untuk setiap day
    const initialDate = startDate.clone()

    // Lakukan iterasi setiap day dalam rentang tanggal
    while (initialDate <= endDate) {
      // Format date sebagai sebuah string hari (cth: "Monday")
      const day = initialDate.format('dddd')

      // Proses isi data dailyOrder dengan data hari, tanggal, dan jumlah total
      dailyOrderData[day] = {
        day: day,
        date: initialDate.format('YYYY-MM-DD'),
        totalAmount: 0
      }

      // Bergeser ke day berikutnya
      // (1): Ini adalah nilai yang akan ditambahkan ke komponen waktu
      // ('day'): Ini adalah satuan waktu yang ingin Anda tambahkan (dalam hal ini, hari)
      // Namun ada berbagai satuan waktu seperti 'day', 'month', 'year', 'hour', 'minute', 'second', dll.
      initialDate.add(1, 'day')
    }

    // Hitung jumlah total untuk setiap day dengan menjumlahkan jumlah pesanan
    completeOrdersInfo?.forEach((order) => {
      // hari apa order tersebut dibuat
      const day = moment(order.createDate).format('dddd')
      const amount = order._sum.amount || 0
      // update total price/amount dalam satu hari itu jika memang dia punya data amount jika tidak isi dengan 0
      dailyOrderData[day].totalAmount += amount
    })

    // Konversikan objek dailyOrderData menjadi sebuah array dan urutkan berdasarkan tanggal
    const endDailyOrderData = Object.values(dailyOrderData).sort((a, b) => moment(a.date).diff(moment(b.date))
    )

    return endDailyOrderData
  } catch (error: any) {
    throw new Error(error)
  }
}
