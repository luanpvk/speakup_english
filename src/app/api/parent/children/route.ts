import { NextRequest } from "next/server";
import {
  handleListChildren,
  handleCreateChild,
} from "@/modules/controllers/parent.controller";

export async function GET(request: NextRequest) {
  return handleListChildren(request);
}

export async function POST(request: NextRequest) {
  return handleCreateChild(request);
}
