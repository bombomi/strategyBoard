package me.kimbomin.board.config;

import lombok.RequiredArgsConstructor;
import me.kimbomin.board.domain.Board;
import me.kimbomin.board.repository.BoardRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final BoardRepository boardRepository;

    @Override
    public void run(String... args) throws Exception {
        // 데이터가 비어있을 때만 샘플 데이터 생성
        if (boardRepository.count() == 0) {
            System.out.println("데이터가 없어 50개의 게시글을 생성합니다.");
            IntStream.rangeClosed(1, 50000).forEach(i -> {
                Board post = Board.builder()
                        .title("게시글 제목 " + i)
                        .content("게시글 내용입니다. 이것은 " + i + "번째 글입니다.")
                        .author("작성자" + ((i % 5) + 1))
                        .build();
                boardRepository.save(post);
            });
        }
    }
}
