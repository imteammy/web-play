"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { CopyBlock, dracula } from "react-code-blocks";
import * as prettier from "prettier";
import typescript from "prettier/plugins/typescript";
import babelPlugin from "prettier/plugins/babel";
import estreePlugin from "prettier/plugins/estree";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { WatchRender } from "@/components/design/watch-render";

type FormValues = {
  method: string;
  header: boolean;
  token: boolean;
  cors: boolean;
  cors_url: string;
  dynamic: string;
  authorization_header: boolean;
  params: boolean;
};
export default function Page() {
  const form = useForm<FormValues>({
    defaultValues: {
      method: "GET",
      header: false,
      token: false,
      cors: false,
      cors_url: "*",
      dynamic: "auto",
      params: false,
      authorization_header: false,
    },
  });
  return (
    <FormProvider {...form}>
      <Form />
      <ShowCode />
    </FormProvider>
  );
}

function Form() {
  const { register, control } = useFormContext<FormValues>();
  return (
    <>
      <h1>Nextjs generate routes</h1>
      <div className="flex gap-4">
        <div className="flex w-full flex-col ">
          <Label htmlFor="method">Method</Label>
          <select
            id="method"
            className="w-full border rounded-md h-9 min-h-9"
            {...register("method")}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div className="flex w-full flex-col ">
          <Label htmlFor="dynamic">Dynamic export</Label>
          <select
            id="dynamic"
            className="w-full border rounded-md h-9 min-h-9"
            {...register("dynamic")}
          >
            <option value="auto">Auto</option>
            <option value="force-static">Force static</option>
            <option value="force-dynamic">Force dynamic</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          className="w-fit size-5"
          type="checkbox"
          id="header"
          {...register("header")}
        />
        <Label htmlFor="header">Header</Label>

        <Input
          className="w-fit size-5"
          type="checkbox"
          id="token"
          {...register("token")}
        />
        <Label htmlFor="token">Token</Label>

        <Input
          className="w-fit size-5"
          id="authorization_header"
          type="checkbox"
          {...register("authorization_header")}
        />
        <Label htmlFor="authorization_header">Authorization Header</Label>

        <Input
          className="w-fit size-5"
          id="cors"
          type="checkbox"
          {...register("cors")}
        />
        <Label htmlFor="cors">Cors</Label>

        <Input
          className="w-fit size-5"
          id="params"
          type="checkbox"
          {...register("params")}
        />
        <Label htmlFor="params">Params</Label>
      </div>
      <WatchRender
        name="cors"
        control={control}
        render={({ values }) => {
          return values ?
              <>
                <Label htmlFor="cors_url">Url orgin</Label>
                <Input
                  placeholder="Origin"
                  id="cors_url"
                  className={cn(values ? "" : "hidden")}
                  {...register("cors_url")}
                />
              </>
            : null;
        }}
      />
    </>
  );
}

function ShowCode() {
  const { watch, getValues } = useFormContext<FormValues>();
  const [text, setText] = useState<string>();

  const getText = useCallback(async () => {
    const values = getValues();

    const createOption = () => {
      const options = [
        values.params && "const slug = (await params).slug;",
        values.header &&
          `
                    const header = await headers();
                    const userAgent = headersList.get("user-agent");
                    const requestHeaders = new Headers(req.headers);
                `,
        values.token && `const token = res.cookies.get('token');`,
        values.authorization_header &&
          values.header &&
          `const authorization = header.get("authorization");`,
        values.authorization_header &&
          !values.header &&
          `const header = await headers();
          const authorization = header.get("authorization");`,
      ];

      return options.filter(Boolean).join("");
    };

    const createImportList = () => {
      const imports = [
        values.header && `import { headers } from "next/headers";`,
      ];

      return imports.filter(Boolean).join("\n");
    };

    const createCorsHeaders = () =>
      `
            headers: {
                'Access-Control-Allow-Origin': '${values.cors_url ?? "*"}',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        `.trim();

    const createParams = () =>
      values.params ?
        ", { params }: { params: Promise<{ slug: string }> }"
      : "";

    const createFunctionTemplate = () => `
            import { NextResponse, type NextRequest } from "next/server";
            ${createImportList()}
            export const dynamic = '${values.dynamic ?? "auto"}';
    
            export async function ${values.method ?? "GET"}(req: NextRequest${createParams()}) {
                ${createOption()}

                return new Response.json({
                    success: true,
                }, {
                    status: 200,
                    ${values.cors ? createCorsHeaders() : ""}
                });
            }
        `;

    const template = createFunctionTemplate();

    prettier
      .format(template, {
        plugins: [babelPlugin, typescript, estreePlugin],
        parser: "typescript",
      })
      .then(setText);
  }, [getValues]);

  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      getText();
    });
    getText();
    return () => {
      unsubscribe();
    };
  }, [watch, getText]);

  return (
    <> {text && <CopyBlock language="tsx" text={text} theme={dracula} />}</>
  );
}
