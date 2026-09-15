import { db as prisma } from "@/app/lib/db"

const main = async () => {
  // await prisma.task.deleteMany()
  // await prisma.project.deleteMany()

  // const testProject = await prisma.project.create({
  //   data: {
  //     title: "Пет-проект Таск Менеджер",
  //     description: "Разработка fullstack приложения на Next.js",
  //     tasks: {
  //       create: [
  //         { title: "Настроить Docker и PostgreSQL", status: "DONE", priority: "HIGH" },
  //         { title: "Сделать первую страницу (Server Component)", status: "IN_PROGRESS", priority: "MEDIUM" },
  //         { title: "Реализовать Канбан-доску на клиенте", status: "TODO", priority: "LOW" },
  //       ]
  //     }
  //   }
  // })
  console.log("ℹ️ Скрипт сидирования запущен, но база данных защищена от изменений.")
  // console.log(`\n✅ База успешно наполнена! Создан проект: "${testProject.title}"`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
