import moment from 'moment'

export default async function getGraphData() {
    try{
        //Intinya syntax dibawah utk Mendapatkan rentang waktu dari 6 hari yang lalu pukul 00:00:00 hingga hari ini pukul 23:59:59,alias mencakup total 7 hari belakangan.
        const startDate = moment().subtract(6, 'days').startOf('day')
        const endDate = moment().endOf('day')

        //Get data order dari database yang dikelompokkan berdasarkan tanggal pembuatan
        const result = await prisma?.order.groupBy({
            by: ['createDate'],
            where: {
                createDate: {
                    gte: startDate.toISOString(),
                    lte: endDate.toISOString()
                },
                status: 'complete'
            },
            _sum: {
                amount: true
            },
        })

        // Inisialisasi objek untuk mengumpulkan data per day
        const aggregatedData: {
            [day: string] : { 
                day: string; 
                date: string; 
                totalAmount: number 
        }
    } = {}

    // Buat salinan dari tanggal awal kemudian melakukan perulangan untuk setiap day
    const currentDate = startDate.clone()

    // Lakukan iterasi setiap day dalam rentang tanggal
    while (currentDate <= endDate) {
        // Format day sebagai sebuah string (cth: "Monday")
        const day = currentDate.format('dddd')
        console.log('day<<<>>>>', day, currentDate)

        // Inisialisasi data yang ter-aggregate untuk day tersebut dengan hari, tanggal, dan jumlah total
        aggregatedData[day] = {
            day,
            date: currentDate.format("YYYY-MM-DD"),
            totalAmount: 0
        }

        // Bergeser ke day berikutnya
        currentDate.add(1, "day")
    }

    // Hitung jumlah total untuk setiap day dengan menjumlahkan jumlah pesanan
    result?.forEach((entry) => {
        const day = moment(entry.createDate).format("dddd")
        const amount = entry._sum.amount || 0
        aggregatedData[day].totalAmount += amount
    })

    // Konversikan objek aggregatedData menjadi sebuah array dan urutkan berdasarkan tanggal
    const formattedData = Object.values(aggregatedData).sort((a, b) => moment(a.date).diff(moment(b.date))
    )

    return formattedData

    }catch(error: any){
        throw new Error(error)
    }
}