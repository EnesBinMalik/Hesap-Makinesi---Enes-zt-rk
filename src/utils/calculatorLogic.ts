import { CalculationResult, Operator } from '../types';

/**
 * Switch-Case Karar Yapısı ile Hesap Makinesi Motoru
 * Hazırlayan: Enes Öztürk
 *
 * Bu fonksiyonda işlemler if-else yerine doğrudan switch-case yapısı
 * kullanılarak dallandırılmakta ve icra edilmektedir.
 */
export function calculateWithSwitchCase(
  num1: number,
  operator: Operator | string,
  num2: number = 0
): CalculationResult {
  let result = 0;
  let matchedCaseCode = '';
  let explanation = '';
  const steps: string[] = [
    `1. Giriş Değerleri: Sayı 1 = ${num1}, İşlem = '${operator}'${operator !== 'sqrt' ? `, Sayı 2 = ${num2}` : ''}`,
    `2. switch(islem) bloğuna girildi. İncelenen anahtar: '${operator}'`,
  ];

  try {
    // ---- SWİTCH - CASE KARAR YAPISI (ENES ÖZTÜRK) ----
    switch (operator) {
      case '+': {
        result = num1 + num2;
        matchedCaseCode = `case '+':\n    sonuc = sayi1 + sayi2;\n    break;`;
        explanation = `Toplama işlemi uygulandı: ${num1} + ${num2} = ${result}`;
        steps.push(`3. 'case +' dalı eşleşti.`);
        steps.push(`4. sonuc = ${num1} + ${num2} formülü ile ${result} bulundu.`);
        steps.push(`5. 'break;' komutu ile switch bloğundan çıkıldı.`);
        break;
      }

      case '-': {
        result = num1 - num2;
        matchedCaseCode = `case '-':\n    sonuc = sayi1 - sayi2;\n    break;`;
        explanation = `Çıkarma işlemi uygulandı: ${num1} - ${num2} = ${result}`;
        steps.push(`3. 'case -' dalı eşleşti.`);
        steps.push(`4. sonuc = ${num1} - ${num2} formülü ile ${result} bulundu.`);
        steps.push(`5. 'break;' komutu ile switch bloğundan çıkıldı.`);
        break;
      }

      case '*':
      case '×': {
        result = num1 * num2;
        matchedCaseCode = `case '*':\ncase '×':\n    sonuc = sayi1 * sayi2;\n    break;`;
        explanation = `Çarpma işlemi uygulandı: ${num1} × ${num2} = ${result}`;
        steps.push(`3. 'case *' dalı eşleşti.`);
        steps.push(`4. sonuc = ${num1} * ${num2} formülü ile ${result} bulundu.`);
        steps.push(`5. 'break;' komutu ile switch bloğundan çıkıldı.`);
        break;
      }

      case '/':
      case '÷': {
        if (num2 === 0) {
          throw new Error('Sıfıra bölme hatası! Matematikte bir sayının sıfıra bölümü tanımsızdır.');
        }
        result = num1 / num2;
        matchedCaseCode = `case '/':\ncase '÷':\n    if (sayi2 == 0) throw new Error("Sıfıra bölünemez!");\n    sonuc = sayi1 / sayi2;\n    break;`;
        explanation = `Bölme işlemi uygulandı: ${num1} ÷ ${num2} = ${result}`;
        steps.push(`3. 'case /' dalı eşleşti. (Sıfır kontrolü başarılı)`);
        steps.push(`4. sonuc = ${num1} / ${num2} formülü ile ${result} bulundu.`);
        steps.push(`5. 'break;' komutu ile switch bloğundan çıkıldı.`);
        break;
      }

      case '%': {
        if (num2 === 0) {
          throw new Error('Sıfıra göre mod alınamaz!');
        }
        result = num1 % num2;
        matchedCaseCode = `case '%':\n    sonuc = sayi1 % sayi2; // Kalan (Mod)\n    break;`;
        explanation = `Mod alma (Kalan) işlemi uygulandı: ${num1} % ${num2} = ${result}`;
        steps.push(`3. 'case %' dalı eşleşti.`);
        steps.push(`4. ${num1}'in ${num2}'ye bölümünden kalan hesaplandı.`);
        steps.push(`5. 'break;' komutu ile switch bloğundan çıkıldı.`);
        break;
      }

      case '^': {
        result = Math.pow(num1, num2);
        matchedCaseCode = `case '^':\n    sonuc = Math.pow(sayi1, sayi2); // Üs alma\n    break;`;
        explanation = `Üs alma işlemi uygulandı: ${num1}^${num2} = ${result}`;
        steps.push(`3. 'case ^' dalı eşleşti.`);
        steps.push(`4. ${num1} üssü ${num2} hesaplandı.`);
        steps.push(`5. 'break;' komutu ile switch bloğundan çıkıldı.`);
        break;
      }

      case 'sqrt': {
        if (num1 < 0) {
          throw new Error('Negatif sayıların karekökü reel sayılar kümesinde hesaplanamaz!');
        }
        result = Math.sqrt(num1);
        matchedCaseCode = `case 'sqrt':\n    if (sayi1 < 0) throw new Error("Negatif kök alınamaz!");\n    sonuc = Math.sqrt(sayi1);\n    break;`;
        explanation = `Karekök işlemi uygulandı: √${num1} = ${result}`;
        steps.push(`3. 'case sqrt' dalı eşleşti.`);
        steps.push(`4. √${num1} değeri ${result} olarak bulundu.`);
        steps.push(`5. 'break;' komutu ile switch bloğundan çıkıldı.`);
        break;
      }

      default: {
        matchedCaseCode = `default:\n    throw new Error("Tanımsız işlem operatörü!");`;
        throw new Error(`Tanımsız işlem türü: "${operator}". Geçerli operatörler: +, -, *, /, %, ^, sqrt`);
      }
    }

    const expression =
      operator === 'sqrt'
        ? `√(${num1}) = ${result}`
        : `${num1} ${operator} ${num2} = ${result}`;

    return {
      num1,
      operator,
      num2,
      result,
      expression,
      matchedCaseCode,
      explanation,
      steps,
      success: true,
      timestamp: Date.now(),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Bilinmeyen hesaplama hatası!';
    steps.push(`HATA: ${errorMsg}`);
    return {
      num1,
      operator,
      num2,
      result: NaN,
      expression: `${num1} ${operator} ${num2} = Hata`,
      matchedCaseCode: matchedCaseCode || 'default:\n    // Hata durumu yakalandı',
      explanation: errorMsg,
      steps,
      success: false,
      error: errorMsg,
      timestamp: Date.now(),
    };
  }
}

/**
 * Format large or floating point numbers cleanly
 */
export function formatDisplayNumber(val: number | string): string {
  if (typeof val === 'string') {
    if (val === 'Error' || val === 'NaN' || val === 'Hata') return 'Hata';
    if (val.endsWith('.')) return val;
    const num = Number(val);
    if (isNaN(num)) return val;
    return formatNumber(num);
  }
  return formatNumber(val);
}

function formatNumber(num: number): string {
  if (isNaN(num)) return 'Hata';
  if (!isFinite(num)) return 'Sonsuz';
  // If integer or small decimals
  if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(6);
  }
  // Trim excessive floating point artifacts
  const str = parseFloat(num.toPrecision(12)).toString();
  return str;
}

export const CSHARP_CODE_SAMPLE = `/*
 * Ödev: Switch-Case Karar Yapısı ile Hesap Makinesi
 * Hazırlayan: Enes Öztürk
 * Dil: C# (.NET Core / Console App)
 */

using System;

namespace HesapMakinesiSwitchCase
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== HESAP MAKİNESİ (SWITCH-CASE) ===");
            Console.WriteLine("Hazırlayan: Enes Öztürk\\n");

            Console.Write("1. Sayıyı giriniz: ");
            double sayi1 = Convert.ToDouble(Console.ReadLine());

            Console.Write("İşlemi seçiniz (+, -, *, /, %, ^): ");
            char islem = Convert.ToChar(Console.ReadLine());

            Console.Write("2. Sayıyı giriniz: ");
            double sayi2 = Convert.ToDouble(Console.ReadLine());

            double sonuc = 0;
            bool hata = false;

            // Switch-Case ile İşlem Kontrolü
            switch (islem)
            {
                case '+':
                    sonuc = sayi1 + sayi2;
                    break;

                case '-':
                    sonuc = sayi1 - sayi2;
                    break;

                case '*':
                    sonuc = sayi1 * sayi2;
                    break;

                case '/':
                    if (sayi2 != 0)
                    {
                        sonuc = sayi1 / sayi2;
                    }
                    else
                    {
                        Console.WriteLine("Hata: Sayı sıfıra bölünemez!");
                        hata = true;
                    }
                    break;

                case '%':
                    sonuc = sayi1 % sayi2;
                    break;

                case '^':
                    sonuc = Math.Pow(sayi1, sayi2);
                    break;

                default:
                    Console.WriteLine("Hata: Geçersiz işlem seçimi yaptınız!");
                    hata = true;
                    break;
            }

            if (!hata)
            {
                Console.WriteLine($"\\nSonuç: {sayi1} {islem} {sayi2} = {sonuc}");
            }

            Console.WriteLine("\\nProgram sonlandı. Çıkmak için bir tuşa basınız.");
            Console.ReadKey();
        }
    }
}`;

export const JS_CODE_SAMPLE = `/**
 * Ödev: Switch-Case Karar Yapısı ile Hesap Makinesi
 * Hazırlayan: Enes Öztürk
 * Dil: JavaScript (ES6+)
 */

function hesapla(sayi1, islem, sayi2) {
    let sonuc;

    switch (islem) {
        case '+':
            sonuc = sayi1 + sayi2;
            break;

        case '-':
            sonuc = sayi1 - sayi2;
            break;

        case '*':
        case 'x':
            sonuc = sayi1 * sayi2;
            break;

        case '/':
            if (sayi2 === 0) {
                return "Hata: Sıfıra bölünemez!";
            }
            sonuc = sayi1 / sayi2;
            break;

        case '%':
            sonuc = sayi1 % sayi2;
            break;

        case '^':
            sonuc = Math.pow(sayi1, sayi2);
            break;

        default:
            return "Hata: Geçersiz işlem operatörü!";
    }

    return sonuc;
}

// Test Örnekleri
console.log("Toplama:", hesapla(10, '+', 5)); // 15
console.log("Bölme:", hesapla(20, '/', 4));   // 5
console.log("Üs Alma:", hesapla(2, '^', 8));  // 256
`;

export const JAVA_CODE_SAMPLE = `/*
 * Ödev: Switch-Case Karar Yapısı ile Hesap Makinesi
 * Hazırlayan: Enes Öztürk
 * Dil: Java
 */

import java.util.Scanner;

public class HesapMakinesi {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Hesap Makinesi - Hazırlayan: Enes Öztürk");

        System.out.print("1. Sayı: ");
        double sayi1 = scanner.nextDouble();

        System.out.print("İşlem (+, -, *, /, %): ");
        char islem = scanner.next().charAt(0);

        System.out.print("2. Sayı: ");
        double sayi2 = scanner.nextDouble();

        double sonuc = 0;
        boolean gecerli = true;

        switch (islem) {
            case '+':
                sonuc = sayi1 + sayi2;
                break;
            case '-':
                sonuc = sayi1 - sayi2;
                break;
            case '*':
                sonuc = sayi1 * sayi2;
                break;
            case '/':
                if (sayi2 != 0) {
                    sonuc = sayi1 / sayi2;
                } else {
                    System.out.println("Sıfıra bölünemez!");
                    gecerli = false;
                }
                break;
            case '%':
                sonuc = sayi1 % sayi2;
                break;
            default:
                System.out.println("Tanımsız işlem!");
                gecerli = false;
        }

        if (gecerli) {
            System.out.printf("Sonuç: %.2f %c %.2f = %.2f\\n", sayi1, islem, sayi2, sonuc);
        }
        scanner.close();
    }
}`;
