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

// Mock Chart
jest.doMock('react-apexcharts', () => () => null);

import Page from "@/app/pokemon/[...slug]/page";
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

describe("Pokemon page", () => {
  it("renders pokemon details", async () => {
    window.fetch = mockFetch({
      "abilities": [
        {
          "ability": {
            "name": "rock-head",
          }
        }
      ],
      "forms": [
        {
          "name": "golem",
        }
      ],
      "height": 14,
      "held_items": [
        {
          "item": {
            "name": "hard-stone",
          },
        }
      ],
      "name": "golem",
      "species": {
        "name": "golem",
      },
      "stats": [
        {
          "base_stat": 80,
          "stat": {
            "name": "hp",
          }
        },
      ],
      "types": [
        {
          "type": {
            "name": "rock",
            "url": "https://pokeapi.co/api/v2/type/6/"
          }
        }
      ],
      "weight": 3000
    });

    const { container, getByTestId } = render(<WrapQueryClient><Page params={{ slug: ['golem'] }} /></WrapQueryClient>);
    await waitFor(() => {
      expect(getByTestId('list')).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
