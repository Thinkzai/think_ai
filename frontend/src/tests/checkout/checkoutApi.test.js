import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  FALLBACK_CARD,
  PAYMENT_TEST_INSTRUMENTS,
  resolvePaymentInstrument,
  simulatePaymentOutcome,
  verifyPayment,
  createOrder,
} from "../../api/checkoutApi";

const CARD_SUCCESS = "4242 4242 4242 4242";
const CARD_DECLINED = "4000 0000 0000 0002";
const CARD_INSUFFICIENT = "4000 0000 0000 9995";
const CARD_NETWORK = "4000 0000 0000 0009";
const CARD_TIMEOUT = "4000 0000 0000 0029";

describe("checkoutApi scenario matrix", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exposes the full Day 13 test-instrument matrix", () => {
    expect(PAYMENT_TEST_INSTRUMENTS).toHaveLength(5);
    expect(PAYMENT_TEST_INSTRUMENTS.map((i) => i.outcome)).toEqual([
      "success",
      "declined",
      "insufficient-funds",
      "network-error",
      "timeout",
    ]);
    expect(FALLBACK_CARD).toBe(CARD_SUCCESS);
  });

  it("resolves each Stripe test card to its simulated scenario", () => {
    expect(resolvePaymentInstrument({ cardNumber: CARD_SUCCESS }).outcome).toBe("success");
    expect(resolvePaymentInstrument({ cardNumber: CARD_DECLINED }).outcome).toBe("declined");
    expect(resolvePaymentInstrument({ cardNumber: CARD_INSUFFICIENT }).outcome).toBe("insufficient-funds");
    expect(resolvePaymentInstrument({ cardNumber: CARD_NETWORK }).outcome).toBe("network-error");
    expect(resolvePaymentInstrument({ cardNumber: CARD_TIMEOUT }).outcome).toBe("timeout");
  });

  it("matches UPI ids and tolerates formatting noise", () => {
    expect(resolvePaymentInstrument({ method: "card", cardNumber: " 4242  4242-4242-4242 " }).outcome).toBe(
      "success"
    );
    expect(resolvePaymentInstrument({ method: "upi", upiId: "someone@okbank 4000000000000002" }).outcome).toBe(
      "declined"
    );
  });

  it("returns null for unknown instruments", () => {
    expect(resolvePaymentInstrument({ cardNumber: "4111 1111 1111 1111" })).toBeNull();
  });

  it("succeeds a payment and returns an enrollment id", async () => {
    const result = await verifyPayment({
      orderId: "o1",
      paymentId: "p1",
      instrument: { outcome: "success" },
    });
    expect(result.success).toBe(true);
    expect(result.enrollmentId).toMatch(/^enr_mock_/);
  });

  it("declines the card with a friendly reason", async () => {
    const result = await verifyPayment({
      orderId: "o1",
      paymentId: "p1",
      instrument: { outcome: "declined" },
    });
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/declined/i);
  });

  it("reports insufficient funds", async () => {
    const result = await verifyPayment({
      orderId: "o1",
      paymentId: "p1",
      instrument: { outcome: "insufficient-funds" },
    });
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/insufficient funds/i);
  });

  it("throws a network error mid-verification", async () => {
    await expect(
      verifyPayment({ orderId: "o1", paymentId: "p1", instrument: { outcome: "network-error" } })
    ).rejects.toThrow(/network error/i);
  });

  it("throws after the timeout window when the gateway never answers", async () => {
    vi.useFakeTimers();
    let capturedError = null;
    verifyPayment({ orderId: "o1", paymentId: "p1", instrument: { outcome: "timeout" } }).then(
      () => {},
      (err) => {
        capturedError = err;
      }
    );
    await vi.advanceTimersByTimeAsync(8500);
    await vi.waitFor(() => expect(capturedError).toBeTruthy());
    expect(capturedError.message).toMatch(/timed out/i);
    vi.useRealTimers();
  });

  it("drives the declined/success outcomes through simulatePaymentOutcome", () => {
    expect(simulatePaymentOutcome({ outcome: "declined" }).success).toBe(false);
    expect(simulatePaymentOutcome({ outcome: "success" }).success).toBe(true);
    expect(() => simulatePaymentOutcome({ outcome: "network-error" })).toThrowError(/network error/i);
    expect(() => simulatePaymentOutcome({ outcome: "timeout" })).toThrowError(/timed out/i);
  });

  it("creates a mock order with the course and amount echoed back", async () => {
    const order = await createOrder({ courseId: "c1", amount: 499, currency: "INR" });
    expect(order.orderId).toMatch(/^order_mock_/);
    expect(order.courseId).toBe("c1");
    expect(order.amount).toBe(499);
    expect(order.currency).toBe("INR");
  });
});