import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddOfferForm from "./AddOfferForm";
import userEvent from "@testing-library/user-event";

jest.mock("../LocationPicker/LocationPicker", () => ({
  LocationPicker: ({ onChange }: any) => {
    return <div data-testid="location-picker-mock" onClick={() => onChange(40.7128, -74.0060, "New York")} />;
  },
  LocationPickerModeEnum: { PickDirect: 0 },
}));

jest.mock("../../Context/MakesContext", () => ({
  useMakes: () => ({
    makes: [
      {
        makeId: 1,
        makeName: "Toyota",
        makeSlug: "toyota",
        offersCount: 10,
        models: {
          1: { modelId: 1, modelName: "Corolla", offersCount: 5 },
          2: { modelId: 2, modelName: "Camry", offersCount: 5 },
        },
      },
      {
        makeId: 2,
        makeName: "Honda",
        makeSlug: "honda",
        offersCount: 8,
        models: {
          3: { modelId: 3, modelName: "Civic", offersCount: 4 },
          4: { modelId: 4, modelName: "Accord", offersCount: 4 },
        },
      },
    ],
    loading: false,
  }),
}));


describe("AddOfferForm", () => {
  const handleOfferSubmit = jest.fn();

  test("renders all form fields", () => {
    render(<AddOfferForm handleOfferFormSubmit={handleOfferSubmit} waitingForResponse={false} />);

    const labels = [
      /Make/i, /Model/i, /Year/i, /Mileage/i, /Fuel Type/i,
      /Transmission/i, /Engine displacement/i, /Engine power/i, /Color/i,
      /VIN/i, /^Title$/i, /^Subtitle$/i, /Description/i, /Features/i,
      /Price/i, /Currency/i
    ];

    labels.forEach(label => {
      expect(screen.getByLabelText(label, { exact: true })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });

  test("calls handleOfferFormSubmit with form data", async () => {
    const user = userEvent.setup();
    const handleOfferSubmit = jest.fn();

    render(
      <AddOfferForm
        handleOfferFormSubmit={handleOfferSubmit}
        waitingForResponse={false}
      />
    );

    await user.click(screen.getByTestId("location-picker-mock"));

    await user.click(screen.getByLabelText(/Make/i));
    await user.click(await screen.findByText(/Toyota/i));

    await user.click(screen.getByLabelText(/Model/i));
    await user.click(await screen.findByText(/Corolla/i));

    await user.type(screen.getByLabelText(/Year/i), "2000");
    await user.type(screen.getByLabelText(/Mileage/i), "10000");
    await user.type(screen.getByLabelText(/Engine power/i), "150");
    await user.type(screen.getByLabelText(/^Title$/i), "Test Car");

    // await user.type(
    //   screen.getByLabelText(/^Description$/i),
    //   "This is description. This is description. This is description. This is description."
    // );

    // all user.type() can be replaced with fireevent.change() to optimize test speed
    fireEvent.change(screen.getByLabelText(/^Description$/i), {
        target: {
            value: "This is description. This is description. This is description. This is description."
        }
    });

    await user.type(screen.getByLabelText(/Price/i), "15000");

    await user.click(screen.getByLabelText(/Fuel Type/i));
    const petrolOption = await screen.findByRole("option", { name: /Petrol/i });
    await user.click(petrolOption);

    await user.click(screen.getByLabelText(/Transmission/i));
    const automaticOption = await screen.findByRole("option", { name: /^Automatic$/i });
    await user.click(automaticOption);

    await user.type(screen.getByLabelText(/Engine displacement/i), "1800");
    await user.type(screen.getByLabelText(/Color/i), "Red");
    await user.type(screen.getByLabelText(/VIN/i), "1HGCM82633A004352");

    await user.click(screen.getByLabelText(/Currency/i));
    const currencyOption = await screen.findByRole("option", { name: /USD/i });
    await user.click(currencyOption);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      const errorElements = document.querySelectorAll(".param-error");
      let hasErrors = false;

      errorElements.forEach((el) => {
        const text = el.textContent?.trim();
        if (text) {
          hasErrors = true;
          console.log("Validation error:", text);
        }
      });

      // Fail test if there are any errors
      expect(hasErrors).toBe(false);
    });

    const errorsDiv = screen.getByTestId("hook-form-errors");
    if (errorsDiv.textContent && errorsDiv.textContent.trim() !== "{}") 
        console.log("RHF errors:", errorsDiv.textContent);

    expect(handleOfferSubmit).toHaveBeenCalledTimes(1);
    expect(handleOfferSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        makeId: 1,
        modelId: 1,
        year: 2000,
        mileage: 10000,
        fuelType: 0, // FuelTypeEnum.Petrol
        transmission: 1, // TransmissionTypeEnum.Automatic
        engineDisplacement: 1800,
        enginePower: 150,
        color: "Red",
        vin: "1HGCM82633A004352",
        title: "Test Car",
        subtitle: "",
        description:
          "This is description. This is description. This is description. This is description.",
        features: [],
        locationLat: 40.7128,
        locationLong: -74.006,
        locationName: "New York",
        price: 15000,
        currency: "Usd", // CurrencyTypeEnum.Usd
        photosFiles: [],
      })
    );
  });
  
  test("does not call handleOfferFormSubmit if required fields are missing", async () => {
    const user = userEvent.setup();
    const handleOfferSubmit = jest.fn();

    render(
      <AddOfferForm
        handleOfferFormSubmit={handleOfferSubmit}
        waitingForResponse={false}
      />
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(handleOfferSubmit).not.toHaveBeenCalled();
  });
});
