using System;

public class CalculateMbAge
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Введите ваше имя");
        string name = Console.ReadLine()!;

        Console.WriteLine("Введите ваш возраст");
        int chronoAge = int.Parse(Console.ReadLine()!);

        Console.WriteLine("Введите ваш пол ('м' или 'ж')");
        string sex = Console.ReadLine()!;

        Console.WriteLine("Введите ваш рост (см)");
        float heightCm = float.Parse(Console.ReadLine()!);

        Console.WriteLine("Введите ваш вес (кг)");
        float weight = float.Parse(Console.ReadLine()!);

        Console.WriteLine("Введите ваш % жира");
        float fat = float.Parse(Console.ReadLine()!);

        float LBM = weight * (1f - fat / 100f);

        float Pers_BMR = 370f + 21.6f * LBM;

        float MbAge = 0f;

        if (sex == "м")
        {
            MbAge = ((10f * weight) + (6.25f * heightCm) - Pers_BMR + 5f) / 5f;
        }
        else         
        {
            MbAge = ((10f * weight) + (6.25f * heightCm) - Pers_BMR - 161f) / 5f;
        }
     
        float deltaAge = MbAge - chronoAge;

        string interpretation = "";

        if (deltaAge <= -5f)
            interpretation = "Отличное метаболическое здоровье";
        else if (deltaAge < -1.5f)
            interpretation = "Хорошее метаболическое здоровье";
        else if (Math.Abs(deltaAge) <= 1.5f)
            interpretation = "Среднее метаболическое здоровье";
        else if (deltaAge < 5f)
            interpretation = "Неоптимальное метаболическое здоровье";
        else
            interpretation = "Плохое метаболическое состояние";

        Console.WriteLine($"\n{name}, ваш метаболический возраст: {MbAge:F1} лет");
        Console.WriteLine($"Разница с хронологическим возрастом: {deltaAge:F1}");
        Console.WriteLine($"Интерпретация: {interpretation}");
    }
}
