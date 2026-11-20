# Проверка метатегов, sitemap, Lighthouse, Core Web Vitals

## 1. Подготовка к аудиту

Проект запущен в продакшен-режиме с помощью Docker Compose. Все контейнеры работают корректно.
![Рисунок 1](screenshots/composeps.png)

Проверка проводилась в окне инкогнито для исключения влияния расширений и кэша.
![Рисунок 2](screenshots/mainPage.png)


### Список страниц для аудита

В таблице 1 представлен список всех страниц проекта «Тильт-платеж», разделенных по типу доступа и способу проверки.

**Таблица 1 — Список страниц проекта для аудита**
| Страница (Route) | Компонент | Тип страницы | Как проверяем | Категории Lighthouse |
| ---- | ---- | ---- | ---- | ---- |
| `/` | HomePage | публичная, есть в sitemap.xml | окно инкогнито, 3 запуска | все 4 |
| `/catalog` | CatalogPage | публичная, есть в sitemap.xml | окно инкогнито, 3 запуска | все 4 |
| `/services/:id` | ServicePage | публичная (динамическая) | окно инкогнито, 3 запуска | все 4 |
| `/login` | LoginPage | закрыта в robots.txt | окно инкогнито, 3 запуска | без SEO |
| `/register` | RegisterPage | закрыта в robots.txt | окно инкогнито, 3 запуска | без SEO |
| `/profile` | ProfilePage | закрыта в robots.txt, нужен вход | после входа в инкогнито, 1 запуск | без SEO |
| `/orders` | OrdersPage | закрыта в robots.txt, нужен вход | после входа в инкогнито, 1 запуск | без SEO |
| `/favorites` | FavoritesPage | закрыта в robots.txt, нужен вход | после входа в инкогнито, 1 запуск | без SEO |
| `/my-services` | MyServicePage | закрыта в robots.txt, нужен вход | после входа в инкогнито, 1 запуск | без SEO |
| `/admin` | AdminPage | закрыта в robots.txt, нужен вход | после входа в инкогнито, 1 запуск | без SEO |
| `/checkout` | CheckoutPage | закрыта в robots.txt, нужен вход | после входа в инкогнито, 1 запуск | без SEO |
| `/payment` | PaymentPage | закрыта в robots.txt, нужен вход | после входа в инкогнито, 1 запуск | без SEO |
| `/wallet` | WalletPage | закрыта (не в sitemap), нужен вход | после входа в инкогнито, 1 запуск | без SEO |
| `/support` | SupportPage | закрыта (не в sitemap), нужен вход | после входа в инкогнито, 1 запуск | без SEO |
| `/settings` | SettingPage | закрыта (не в sitemap), нужен вход | после входа в инкогнито, 1 запуск | без SEO |
| `/services/new` (или edit) | ServiceFormPage | закрыта (не в sitemap), нужен вход | после входа в инкогнито, 1 запуск | без SEO |

## 2. Аудит Lighthouse

Аудит проводился в окне инкогнито в режиме Desktop по четырем категориям. 
Для публичных страниц было выполнено по 3 запуска, в таблицу заносится медианное значение.

### 2.1. Главная страница (/)

**Результаты трех запусков:**
* Запуск 1: Performance 100, Accessibility 78, Best Practices 100, SEO 100.
* Запуск 2: Performance 100, Accessibility 78, Best Practices 100, SEO 100.
* Запуск 3: Performance 100, Accessibility 78, Best Practices 100, SEO 100.

**Медианные значения:** 
* Performance: **100**
* Accessibility: **78** 
* Best Practices: **100**
* SEO: **100**

**Метрики производительности (первый запуск):**
* FCP (First Contentful Paint): 0.7 s
* LCP (Largest Contentful Paint): 0.7 s
* TBT (Total Blocking Time): 0 ms
* CLS (Cumulative Layout Shift): 0
* Speed Index: 0.7 s

![Результаты Lighthouse для главной страницы](screenshots/home_run1.png)

### 2.2. Страница Каталога (/catalog)

**Результаты трех запусков:**
* Запуск 1: Performance 100, Accessibility 84, Best Practices 100, SEO 100.
* Запуск 2: Performance 100, Accessibility 84, Best Practices 100, SEO 100.
* Запуск 3: Performance 100, Accessibility 84, Best Practices 100, SEO 100.

**Медианные значения:** 
* Performance: **100**
* Accessibility: **84** 
* Best Practices: **100**
* SEO: **100**

**Метрики производительности (первый запуск):**
* FCP (First Contentful Paint): 0.7 s
* LCP (Largest Contentful Paint): 0.7 s
* TBT (Total Blocking Time): 0 ms
* CLS (Cumulative Layout Shift): 0
* Speed Index: 0.7 s

![Результаты Lighthouse для страницы каталога](screenshots/catalog_run1.png)
*Рисунок 4 — Оценки Lighthouse для страницы каталога*