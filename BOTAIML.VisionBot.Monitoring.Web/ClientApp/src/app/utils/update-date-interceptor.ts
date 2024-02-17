import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class UpdateDateHttpInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (req.method === "POST" || req.method === "PUT") {
            this.shiftDates(req.body);
        }
        return next.handle(req);
    }

    shiftDates(body) {
        if (body === null || body === undefined) {
            return body;
        }

        if (typeof body !== "object") {
            return body;
        }

        for (const key of Object.keys(body)) {
            const value = body[key];
            if (value instanceof Date) {
                body[key] = new Date(
                    Date.UTC(
                        value.getFullYear(),
                        value.getMonth(),
                        value.getDate(),
                        value.getHours(),
                        value.getMinutes(),
                        value.getSeconds()
                    )
                );
            } else if (typeof value === "object") {
                this.shiftDates(value);
            }
        }
    }
}