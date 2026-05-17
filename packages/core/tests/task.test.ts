import { describe, expect, it } from "vitest";
import { isSuccessStatus, isTerminalStatus, parseTaskResponse } from "../src/task.js";

describe("task", () => {
  describe("isTerminalStatus", () => {
    it("should return true for completed", () => {
      expect(isTerminalStatus("completed")).toBe(true);
    });

    it("should return true for succeeded", () => {
      expect(isTerminalStatus("succeeded")).toBe(true);
    });

    it("should return true for failed", () => {
      expect(isTerminalStatus("failed")).toBe(true);
    });

    it("should return false for pending", () => {
      expect(isTerminalStatus("pending")).toBe(false);
    });

    it("should return false for running", () => {
      expect(isTerminalStatus("running")).toBe(false);
    });

    it("should return false for queued", () => {
      expect(isTerminalStatus("queued")).toBe(false);
    });

    it("should return false for processing", () => {
      expect(isTerminalStatus("processing")).toBe(false);
    });
  });

  describe("isSuccessStatus", () => {
    it("should return true for completed", () => {
      expect(isSuccessStatus("completed")).toBe(true);
    });

    it("should return true for succeeded", () => {
      expect(isSuccessStatus("succeeded")).toBe(true);
    });

    it("should return false for failed", () => {
      expect(isSuccessStatus("failed")).toBe(false);
    });

    it("should return false for pending", () => {
      expect(isSuccessStatus("pending")).toBe(false);
    });
  });

  describe("parseTaskResponse", () => {
    it("should parse a pending task response", () => {
      const result = parseTaskResponse({
        task_info: { id: "task-123", status: "pending" },
      });

      expect(result.taskId).toBe("task-123");
      expect(result.status).toBe("pending");
      expect(result.error).toBeUndefined();
      expect(result.results).toBeUndefined();
    });

    it("should parse a completed task response with images", () => {
      const result = parseTaskResponse(
        {
          task_info: { id: "task-456", status: "completed" },
          images: ["https://example.com/image1.png", "https://example.com/image2.png"],
        },
        "images",
      );

      expect(result.taskId).toBe("task-456");
      expect(result.status).toBe("completed");
      expect(result.results).toEqual([
        "https://example.com/image1.png",
        "https://example.com/image2.png",
      ]);
    });

    it("should parse a completed task response with videos", () => {
      const result = parseTaskResponse(
        {
          task_info: { id: "task-789", status: "succeeded" },
          videos: ["https://example.com/video.mp4"],
        },
        "videos",
      );

      expect(result.status).toBe("succeeded");
      expect(result.results).toEqual(["https://example.com/video.mp4"]);
      expect(result.resultKey).toBe("videos");
    });

    it("should parse a failed task with error detail", () => {
      const result = parseTaskResponse({
        task_info: {
          id: "task-err",
          status: "failed",
          error: { detail: "Content policy violation" },
        },
      });

      expect(result.status).toBe("failed");
      expect(result.error).toBe("Content policy violation");
      expect(result.results).toBeUndefined();
    });

    it("should parse a failed task with error title", () => {
      const result = parseTaskResponse({
        task_info: {
          id: "task-err",
          status: "failed",
          error: { title: "Timeout" },
        },
      });

      expect(result.error).toBe("Timeout");
    });

    it("should parse a failed task with string error", () => {
      const result = parseTaskResponse({
        task_info: {
          id: "task-err",
          status: "failed",
          error: "Something went wrong",
        },
      });

      expect(result.error).toBe("Something went wrong");
    });

    it("should handle missing task_info gracefully", () => {
      const result = parseTaskResponse({});

      expect(result.taskId).toBe("");
      expect(result.status).toBe("pending");
    });

    it("should handle unknown status as pending", () => {
      const result = parseTaskResponse({
        task_info: { id: "task-x", status: "unknown_status" },
      });

      expect(result.status).toBe("pending");
    });

    it("should not return results for non-success status", () => {
      const result = parseTaskResponse(
        {
          task_info: { id: "task-pending", status: "running" },
          images: ["should-not-be-returned"],
        },
        "images",
      );

      expect(result.results).toBeUndefined();
    });

    it("should use default result key of images", () => {
      const result = parseTaskResponse({
        task_info: { id: "t", status: "completed" },
        images: ["url"],
      });

      expect(result.resultKey).toBe("images");
      expect(result.results).toEqual(["url"]);
    });
  });
});
