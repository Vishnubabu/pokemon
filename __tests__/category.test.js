/**
 * @jest-environment jsdom
 */
import { render, cleanup, waitFor } from "@testing-library/react";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      replace: () => null
    };
  }
}));

import Page from "@/app/category/[...slug]/page";
import WrapQueryClient from "@/app/components/WrapQueryClient";

function mockFetch(data) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data,
    }),
  );
}

afterEach(cleanup);

describe("Category page", () => {
  it("renders pokemon list", async () => {
    window.fetch = mockFetch({
      "name": "rock",
      "pokemon": [
        {
          "pokemon": {
            "name": "geodude",
            "url": "https://pokeapi.co/api/v2/pokemon/74/"
          }
        },
        {
          "pokemon": {
            "name": "graveler",
            "url": "https://pokeapi.co/api/v2/pokemon/75/"
          }
        },
        {
          "pokemon": {
            "name": "golem",
            "url": "https://pokeapi.co/api/v2/pokemon/76/"
          }
        },
      ]
    });

    const { getByTestId } = render(<WrapQueryClient><Page params={{ slug: ['rock'] }} /></WrapQueryClient>);
    await waitFor(() => {
      expect(getByTestId('list')).toBeInTheDocument();
    });

    const listNode = getByTestId('list');
    expect(listNode.children).toHaveLength(3);
  });
});
