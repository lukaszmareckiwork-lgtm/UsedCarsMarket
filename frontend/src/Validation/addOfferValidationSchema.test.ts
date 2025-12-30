import { addOfferValidationSchema } from "./addOfferValidationSchema";
import * as Yup from "yup";

describe("addOfferValidationSchema", () => {
  describe("makeId", () => {
    test("accepts a valid makeId", async () => {
      await expect(
        addOfferValidationSchema.validateAt("makeId", {
          makeId: 23,
        })
      ).resolves.toBeDefined();
    });

    test("rejects makeId of 0 nad below", async () => {
      await expect(
        addOfferValidationSchema.validateAt("makeId", {
          makeId: 0,
        })
      ).rejects.toThrow();
    });
  });

  describe("modelId", () => {
    test("accepts a valid modelId", async () => {
      await expect(
        addOfferValidationSchema.validateAt("modelId", {
          modelId: 23,
        })
      ).resolves.toBeDefined();
    });

    test("rejects modelId of 0 nad below", async () => {
      await expect(
        addOfferValidationSchema.validateAt("modelId", {
          modelId: 0,
        })
      ).rejects.toThrow();
    });
  });

  describe("year", () => {
    test("accepts a valid year", async () => {
      await expect(
        addOfferValidationSchema.validateAt("year", {
          year: 2000,
        })
      ).resolves.toBeDefined();
    });

    test("rejects year below 1900", async () => {
      await expect(
        addOfferValidationSchema.validateAt("year", {
          year: 1899,
        })
      ).rejects.toThrow();
    });

    test("rejects year decimal value", async () => {
      await expect(
        addOfferValidationSchema.validateAt("year", {
          year: 1920.2,
        })
      ).rejects.toThrow();
    });

    test("rejects year undefined", async () => {
      await expect(
        addOfferValidationSchema.validateAt("year", {
          year: undefined,
        })
      ).rejects.toThrow();
    });

    test("rejects year exceeding current year", async () => {
      await expect(
        addOfferValidationSchema.validateAt("year", {
          year: new Date().getFullYear() + 1,
        })
      ).rejects.toThrow();
    });

    test("year transforms empty string to null", () => {
      const yearSchema = addOfferValidationSchema.fields.year as Yup.NumberSchema;

      // required field transformation cannot be tested with validateAt directly
      // assert: false - disables type enforcement
      const result = yearSchema.cast("", { assert: false });
      expect(result).toBeNull();
    });

    test("transforms empty year string to null before failing validation", async () => {
      try {
        await addOfferValidationSchema.validateAt("year", { year: "" });
      } catch (err: any) {
        expect(err.value).toBeNull();
        expect(err.message).toBe("Year is required");
      }
    });
  });

  describe("mileage", () => {
    test("accepts valid mileage", async () => {
      await expect(
        addOfferValidationSchema.validateAt("mileage", { mileage: 120_000 })
      ).resolves.toBeDefined();
    });

    test("rejects negative mileage", async () => {
      await expect(
        addOfferValidationSchema.validateAt("mileage", { mileage: -1 })
      ).rejects.toThrow();
    });

    test("rejects decimal mileage", async () => {
      await expect(
        addOfferValidationSchema.validateAt("mileage", { mileage: 10.5 })
      ).rejects.toThrow();
    });

    test("transforms empty string to null before failing required", async () => {
      try {
        await addOfferValidationSchema.validateAt("mileage", { mileage: "" });
      } catch (err: any) {
        expect(err.value).toBeNull();
        expect(err.message).toBe("Mileage is required");
      }
    });
  });

  describe("enginePower", () => {
    test("accepts valid engine power", async () => {
      await expect(
        addOfferValidationSchema.validateAt("enginePower", { enginePower: 150 })
      ).resolves.toBeDefined();
    });

    test("rejects negative engine power", async () => {
      await expect(
        addOfferValidationSchema.validateAt("enginePower", { enginePower: -10 })
      ).rejects.toThrow();
    });

    test("rejects decimal engine power", async () => {
      await expect(
        addOfferValidationSchema.validateAt("enginePower", {
          enginePower: 120.5,
        })
      ).rejects.toThrow();
    });

    test("transforms empty string to null before failing required", async () => {
      try {
        await addOfferValidationSchema.validateAt("enginePower", {
          enginePower: "",
        });
      } catch (err: any) {
        expect(err.value).toBeNull();
        expect(err.message).toBe("Engine power is required");
      }
    });
  });

  describe("fuelType", () => {
    test("accepts valid fuelType", async () => {
      await expect(
        addOfferValidationSchema.validateAt("fuelType", { fuelType: 1 })
      ).resolves.toBeDefined();
    });

    test("rejects undefined fuelType", async () => {
      await expect(
        addOfferValidationSchema.validateAt("fuelType", { fuelType: undefined })
      ).rejects.toThrow();
    });
  });

  describe("transmission", () => {
    test("accepts valid transmission", async () => {
      await expect(
        addOfferValidationSchema.validateAt("transmission", { transmission: 0 })
      ).resolves.toBeDefined();
    });

    test("rejects undefined transmission", async () => {
      await expect(
        addOfferValidationSchema.validateAt("transmission", {
          transmission: undefined,
        })
      ).rejects.toThrow();
    });
  });

  describe("engineDisplacement", () => {
    test("accepts valid numeric value", async () => {
      await expect(
        addOfferValidationSchema.validateAt("engineDisplacement", {
          engineDisplacement: 2.0,
        })
      ).resolves.toBeDefined();
    });

    test("rounds string value to two decimals", async () => {
      const result = await addOfferValidationSchema.validateAt(
        "engineDisplacement",
        { engineDisplacement: "1998,567" }
      );
      expect(result).toBe(1998.57);
    });

    test("rejects non-numeric value", async () => {
      await expect(
        addOfferValidationSchema.validateAt("engineDisplacement", {
          engineDisplacement: "abc",
        })
      ).rejects.toThrow();
    });

    test("rejects undefined value", async () => {
      await expect(
        addOfferValidationSchema.validateAt("engineDisplacement", {
          engineDisplacement: undefined,
        })
      ).rejects.toThrow();
    });
  });

  describe("color", () => {
    test("accepts string color", async () => {
      await expect(
        addOfferValidationSchema.validateAt("color", { color: "Red" })
      ).resolves.toBeDefined();
    });

    test("accepts null color", async () => {
      await expect(
        addOfferValidationSchema.validateAt("color", { color: null })
      ).resolves.toBeDefined();
    });
  });

  describe("vin", () => {
    test("accepts valid VIN", async () => {
      await expect(
        addOfferValidationSchema.validateAt("vin", {
          vin: "1HGCM82633A004352",
        })
      ).resolves.toBeDefined();
    });

    test("rejects invalid VIN length", async () => {
      await expect(
        addOfferValidationSchema.validateAt("vin", {
          vin: "123",
        })
      ).rejects.toThrow();
    });

    test("accepts null VIN", async () => {
      await expect(
        addOfferValidationSchema.validateAt("vin", { vin: null })
      ).resolves.toBeDefined();
    });
  });

  describe("title", () => {
    test("accepts valid title", async () => {
      await expect(
        addOfferValidationSchema.validateAt("title", {
          title: "Well maintained vehicle",
        })
      ).resolves.toBeDefined();
    });

    test("rejects short title", async () => {
      await expect(
        addOfferValidationSchema.validateAt("title", { title: "Car" })
      ).rejects.toThrow();
    });
  });

  describe("subtitle", () => {
    test("accepts valid subtitle", async () => {
      await expect(
        addOfferValidationSchema.validateAt("subtitle", {
          subtitle: "Low mileage, first owner",
        })
      ).resolves.toBeDefined();
    });

    test("accepts null subtitle", async () => {
      await expect(
        addOfferValidationSchema.validateAt("subtitle", { subtitle: null })
      ).resolves.toBeDefined();
    });
  });

  describe("description", () => {
    test("accepts valid description", async () => {
      await expect(
        addOfferValidationSchema.validateAt("description", {
          description:
            "This car is in excellent condition with full service history.",
        })
      ).resolves.toBeDefined();
    });

    test("rejects short description", async () => {
      await expect(
        addOfferValidationSchema.validateAt("description", {
          description: "Too short",
        })
      ).rejects.toThrow();
    });

    test("accepts null description", async () => {
      await expect(
        addOfferValidationSchema.validateAt("description", {
          description: null,
        })
      ).resolves.toBeDefined();
    });
  });

  describe("location", () => {
    test("accepts valid latitude", async () => {
      await expect(
        addOfferValidationSchema.validateAt("locationLat", {
          locationLat: 52.23,
        })
      ).resolves.toBeDefined();
    });

    test("accepts valid longitude", async () => {
      await expect(
        addOfferValidationSchema.validateAt("locationLong", {
          locationLong: 21.01,
        })
      ).resolves.toBeDefined();
    });

    test("rejects missing latitude", async () => {
      await expect(
        addOfferValidationSchema.validateAt("locationLat", {
          locationLat: undefined,
        })
      ).rejects.toThrow();
    });

    test("rejects missing longitude", async () => {
      await expect(
        addOfferValidationSchema.validateAt("locationLong", {
          locationLong: undefined,
        })
      ).rejects.toThrow();
    });
  });

  describe("price", () => {
    test("accepts valid price", async () => {
      await expect(
        addOfferValidationSchema.validateAt("price", { price: 5000 })
      ).resolves.toBeDefined();
    });

    test("rounds string price correctly", async () => {
      const result = await addOfferValidationSchema.validateAt("price", {
        price: "12 345,678",
      });
      expect(result).toBe(12345.68);
    });

    test("rejects too cheap price", async () => {
      await expect(
        addOfferValidationSchema.validateAt("price", { price: 50 })
      ).rejects.toThrow();
    });
  });

  describe("photos", () => {
    test("accepts null photos", async () => {
      await expect(
        addOfferValidationSchema.validateAt("photos", { photos: null })
      ).resolves.toBeDefined();
    });

    test("accepts array of files", async () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      await expect(
        addOfferValidationSchema.validateAt("photos", {
          photos: [file],
        })
      ).resolves.toBeDefined();
    });
  });
});