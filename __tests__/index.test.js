/**
 * @jest-environment jsdom
 */
import { render, cleanup, waitFor } from "@testing-library/react";
import Page from "@/app/page";

function mockFetch(data) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data,
    }),
  );
}

afterEach(cleanup);

describe("Home", () => {
  it("renders category list", async () => {
    window.fetch = mockFetch({
      "results": [
        {
          "name": "normal",
          "url": "https://pokeapi.co/api/v2/type/1/"
        },
        {
          "name": "fighting",
          "url": "https://pokeapi.co/api/v2/type/2/"
        },
        {
          "name": "flying",
          "url": "https://pokeapi.co/api/v2/type/3/"
        },
      ]
    });

    const { getByTestId } = render(<Page />);
    await waitFor(() => {
      expect(getByTestId('list')).toBeInTheDocument();
    });

    const listNode = getByTestId('list');
    expect(listNode.children).toHaveLength(3);
  });
});
