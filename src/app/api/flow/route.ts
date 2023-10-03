import controlJsonFile from "@/utils/controlJsonFile";
import { NextResponse } from "next/server";

export const GET = async () => {
  return new Response("hello");
};

export const POST = async (req: Request, res: Response) => {
  const body = await req.json();

  try {
    controlJsonFile(body);
    return NextResponse.json(
      {
        message: "Good JSON",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);
    const errorMessage = error.toString();

    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: 400,
      }
    );
  }
};
