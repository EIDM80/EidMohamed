# مهارات OpenCreator (KrillinAI)

منقولة من [krillinai/OpenCreator](https://github.com/krillinai/OpenCreator) (رخصة Apache-2.0).

| المهارة | ماذا تفعل |
|---|---|
| `krillinai-cli` | المهارة الرئيسية: تختار الأمر المناسب، وتقرأ الإعدادات والمخرجات والأخطاء |
| `krillinai-subtitle` | ترجمات من يوتيوب أو فيديو محلي: تنزيل الترجمة أو تفريغ الصوت بـ Whisper، ثم الترجمة لأي لغة، مع ملفات SRT ثنائية اللغة وترجمات قصيرة للفيديو العمودي |
| `krillinai-tts` | دبلجة صوتية باللغة المستهدفة انطلاقاً من ملف الترجمة، مع إمكانية إخراج فيديو مدبلج |
| `krillinai-render-horizontal` | إخراج فيديو أفقي بترجمة ثنائية اللغة أو بالدبلجة |
| `krillinai-render-vertical` | إخراج فيديو عمودي (Reels/Shorts/TikTok) بعنوان وترجمة أو دبلجة |
| `krillinai-cover` | توليد صورة غلاف من برومبت نصي |
| `krillinai-pipeline` | التحقق من خطة إنتاج متعددة المراحل (dry-run فقط) |

## مثال استخدام

«خذ فيديو يوتيوب هذا عن التسويق، ترجمه للعربية، واعمل منه ريل عمودي بترجمة ثنائية اللغة».

## التثبيت (مرة واحدة)

المهارات هنا تحتوي على التعليمات فقط. أداة التشغيل (CLI مكتوبة بلغة Go) موجودة داخل مستودع OpenCreator، ويجب بناؤها على جهازك:

```bash
bash .claude/skills/krillinai-cli/scripts/setup-opencreator.sh
```

يحتاج السكربت إلى: `git` و `node` و `go` و `ffmpeg` و `yt-dlp`. بعد انتهائه، أضف مفاتيح مزوّدي الخدمة (OpenAI أو Aliyun أو MiniMax...) في ملف `runtime/krillinai/config/config.toml` داخل مجلد OpenCreator.

## ملاحظة عن الترجمة للعربية
أمثلة المهارات الأصلية تستخدم الصينية كلغة هدف (`zh_cn`). للعربية استخدم `--target-lang ar` (الرمز موجود في كود الـCLI)، وجرّب الأمر مع `--dry-run` أولاً للتأكد من صحة الصيغة.
