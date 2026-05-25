# Server və Bot İdarəetmə Rəhbəri (Server & Bot Management Guide)

Bu fayl **Bond.az** layihəsinin server konfiqurasiyasını, botların işləmə məntiqini və logların izlənilməsi qaydalarını özündə saxlayır.

---

## 1. Server Məlumatları və Qoşulma Ardıcıllığı

* **Server IP:** `176.118.167.14`
* **İstifadəçi adı (Login):** `root`
* **Layihə Qovluğu (Serverdə):** `/root/Bond.az`

### Qoşulma Addımları (SSH):
1. Windows-da **CMD** (Command Prompt) proqramını açın.
2. Aşağıdakı əmri yazıb **Enter** düyməsini basın:
   ```bash
   ssh root@176.118.167.14
   ```
3. Şifrəni (`6V7vSmUP5bEY`) kopyalayıb CMD-yə sağ kliklə yapışdırın və **Enter** basın.

---

## 2. Layihə Qovluğuna Keçid və Əllə Yoxlama
Qoşulduqdan sonra layihə qovluğuna keçmək və botları əllə yoxlamaq üçün bu əmrləri yazın:
```bash
# Qovluğa keçid
cd /root/Bond.az

# Oxu.az Botunu əllə 1 dəfə işə salmaq
npx tsx scripts/news-bot.ts

# Investing.com Botunu əllə 1 dəfə işə salmaq
npx tsx scripts/news-investingcom.ts

# Marja Botunu əllə 1 dəfə işə salmaq
npx tsx scripts/marja-bot.ts
```

---

## 3. Avtomatik Planlayıcı (Cron Jobs)
Botlar hər **30 dəqiqədən bir** avtomatik işə düşmək üçün Linux Cron sistemində konfiqurasiya edilib.

### Planlayıcıya baxmaq:
```bash
crontab -l
```

### Planlayıcıda dəyişiklik etmək (Redaktə):
1. Terminalda yazın: `crontab -e` (Əgər redaktor soruşsa `1` seçin).
2. Quraşdırılmış mövcud sətirlər:
   ```cron
   */30 * * * * cd /root/Bond.az && /usr/bin/npx tsx scripts/news-bot.ts >> /root/news-bot.log 2>&1
   */30 * * * * cd /root/Bond.az && /usr/bin/npx tsx scripts/news-investingcom.ts >> /root/news-investingcom.log 2>&1
   ```
3. Saxlayıb çıxmaq üçün: **Ctrl + O** -> **Enter** -> **Ctrl + X**.

---

## 4. Logların (İş Gedişatının) Canlı İzlənilməsi
Botların hansı xəbərləri paylaşdığını və ya hər hansı xəta olub-olmadığını canlı görmək üçün aşağıdakı əmrləri yazın:

* **Oxu.az Botunun logları:**
  ```bash
  tail -f /root/news-bot.log
  ```
* **Investing.com Botunun logları:**
  ```bash
  tail -f /root/news-investingcom.log
  ```
* **Marja Botunun logları (əgər cron-a əlavə edilibsə):**
  ```bash
  tail -f /root/marja-bot.log
  ```

*(Canlı izləmə rejimindən çıxmaq üçün klaviaturada **Ctrl + C** basın. Bu, botun işini dayandırmır, sadəcə baxış pəncərəsini bağlayır).*

---

## 5. Botların İşləmə Məntiqi (Backend Logic)

Botlar TypeScript ilə yazılıb və `scripts/` qovluğunda yerləşir:

1. **`news-bot.ts` (Oxu.az Botu):**
   * Oxu.az RSS feed-indən (`https://oxu.az/feed`) ən son xəbərləri oxuyur.
   * Supabase bazasında bu xəbərin olub-olmadığını yoxlayır (əgər varsa, keçir).
   * Yeni xəbərin mətnini **DeepSeek API** vasitəsilə 3 dilə (Azərbaycan, İngilis, Rus) SEO qaydalarına uyğun (h1, title, seo_title, description, tags, faqs) yenidən yazdırır (AI Rewrite).
   * **OpenAI Image (GPT Image 2)** vasitəsilə xəbərin başlığına uyğun süni intellekt posteri hazırlayır.
   * Şəkli sıxaraq **Cloudflare R2** bulud yaddaşına yükləyir.
   * 3 dildə yazılmış xəbəri, R2 şəkil linkini və təyin edilmiş müəllifi Supabase bazasına yazır.
   * Sonda **Google Indexing API** vasitəsilə Google-a xəbərin dərhal indekslənməsi üçün ping göndərir.

2. **`news-investingcom.ts` (Investing Botu):**
   * Eyni məntiqlə işləyir, lakin Investing.com saytının maliyyə xəbərlərini toplayır və eyni şəkildə AI ilə redaktə edib bazaya əlavə edir.

3. **`marja-bot.ts` (Marja Botu):**
   * Marja.az saytından maliyyə/iqtisadiyyat xəbərlərini toplayır və bazaya yazır.
