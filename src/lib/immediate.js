export default function immediate(task) {
  queueMicrotask(task)
}
