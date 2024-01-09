// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList() {
    return this.#list
  }

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    let randomNumber = Math.trunc(Math.random() * 100000)

    while (
      randomNumber === 0 ||
      Product.#list.find(
        (product) => product.id === randomNumber,
      ) !== undefined
    ) {
      randomNumber = Math.trunc(Math.random() * 100000)
    }
    this.id = Math.trunc(Math.random() * 100000)
    this.createDate = new Date()
    this.name = name
    this.price = price
    this.description = description
  }

  static getList() {
    return this.#list
  }

  static add(product) {
    this.#list.push(product)
  }

  static getById(id) {
    return this.#list.find((product) => product.id === id)
  }

  static updateById(id, data) {
    const product = this.getById(id)

    if (product === undefined) {
      return false
    }

    const { name, price, description } = data

    if (name) {
      product.name = name
    }

    if (price) {
      product.price = price
    }

    if (description) {
      product.description = description
    }

    return true
  }

  static deleteById(id) {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

/////////////////////////////

Product.add(new Product('TV', 1250, 'Toshiba, 100 inches'))

Product.add(
  new Product(
    'Стіл із регулюванням висоти',
    4699,
    'Стіл із регулюванням висоти RZTK Desk Compact White 700 х 400 мм',
  ),
)

Product.add(
  new Product(
    'Кавовий столик',
    2802,
    'Кавовий столик Nowy Styl FINE ordf ALU (36) D680 Білий',
  ),
)

Product.add(
  new Product(
    'Кавовий столик',
    2802,
    'Кавовий столик Nowy Styl FINE ordf ALU (36) D680 Білий',
  ),
)

Product.add(
  new Product(
    'Кавовий столик',
    2802,
    'Кавовий столик Nowy Styl FINE ordf ALU (36) D680 Білий',
  ),
)

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі

    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/user-create', function (req, res) {
  // console.log(req.body)

  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: 'Користувача створено',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  // console.log(id)

  // console.log(typeof id)

  User.deleteById(Number(id))

  // if (user) {
  //   console.log('!!!!!!!!!!!!!!')
  // }

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувача видалено',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  console.log(email, password, id)

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Сталася помилка',
  })
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі

    style: 'product-create',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/product-create', function (req, res) {
  console.log(req.body)

  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    info: 'Успішне виконання дії',
    details: 'Товар був успішно доданий',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі

    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))

  if (product === undefined) {
    res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Сталася помилка',
      details: 'Товар з таким ID не знайдено',
    })
  } else {
    res.render('product-edit', {
      style: 'product-edit',

      data: {
        product: product,
      },
    })
  }
})

//================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  const result = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  let info = ''
  let details = ''

  if (result === true) {
    info = 'Успішне виконання дії'
    details = 'Товар був успішно оновлено'
  } else {
    info = 'Сталася помилка'
    details = 'Товар не був оновлений'
  }

  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    info: info,
    details: details,
  })
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  const result = Product.deleteById(Number(id))

  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    info: 'Успішне виконання дії',
    details: 'Товар було успішно видалено',
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
